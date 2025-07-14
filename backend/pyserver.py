from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import requests
import fitz
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from langchain_core.messages import trim_messages

from dotenv import load_dotenv
import os

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
# Flask setup
app = Flask(__name__)
CORS(app)

# Memory stores
session_vectorstores = {}
session_histories = {}


# Groq LLM
llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama-3.3-70b-versatile"
)

# System role instruction
system_message = (
    "You are a business pitch assistant for investors. "
    "You must answer questions strictly based on the content of the business pitch PDF provided. "
    "If the information is not found in the PDF, reply with: 'This information is not available in the document.' "
    "Be brief, professional, and to the point. Do not hallucinate."
)

# Prompt setup
prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name="messages")
])

# Combined chain
chain = prompt | llm

# Chat memory manager
def get_session_history(session_id):
    if session_id not in session_histories:
        session_histories[session_id] = ChatMessageHistory()
    return session_histories[session_id]

with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history=get_session_history
)

# Load and index PDF
def load_and_index_pdf(pdf_url):
    headers = { "User-Agent": "Mozilla/5.0" }
    response = requests.get(pdf_url, headers=headers)
    if response.status_code != 200:
        raise Exception("Failed to fetch PDF")

    pdf = fitz.open(stream=response.content, filetype="pdf")
    docs = [Document(page_content=page.get_text(), metadata={"page": i + 1}) for i, page in enumerate(pdf)]

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(docs)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.from_documents(split_docs, embeddings)

# Start chat route
@app.route("/start-chat", methods=["POST"])
def start_chat():
    data = request.json
    pdf_url = data.get("pdfUrl")
    if not pdf_url:
        return jsonify({"error": "Missing PDF URL"}), 400

    try:
        session_id = str(uuid.uuid4())
        vectorstore = load_and_index_pdf(pdf_url)
        session_vectorstores[session_id] = vectorstore
        return jsonify({"sessionId": session_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ask question route
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    session_id = data.get("sessionId")
    query = data.get("question")
    if not session_id or not query:
        return jsonify({"error": "Missing sessionId or question"}), 400

    try:
        if session_id not in session_vectorstores:
            return jsonify({"error": "Session not found or PDF not loaded"}), 404

        vectorstore = session_vectorstores[session_id]
        relevant_docs = vectorstore.similarity_search(query, k=3)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])

        # Create a clear augmented query
        augmented_query = f"""
You are an AI assistant helping an investor understand a business pitch.

--- Pitch Document Content Start ---
{context}
--- Pitch Document Content End ---


Question: {query}
"""

        # Get chat history
        session_history = get_session_history(session_id)
        messages = session_history.messages + [HumanMessage(content=augmented_query)]

        # Use more tokens to avoid over-trimming
        trimmed_messages = trim_messages(
            messages,
            max_tokens=1500,
            token_counter=llm,
            strategy="last",
            start_on="human"
        )

        response = with_message_history.invoke(
            {"messages": trimmed_messages},
            config={"configurable": {"session_id": session_id}}
        )

        # Handle empty response
        final_answer = response.content.strip()
        if not final_answer:
            final_answer = "Sorry, I couldn't find this information in the document."

        # Save original question and model response in memory
        session_history.add_message(HumanMessage(content=query))
        session_history.add_message(response)

        return jsonify({"answer": final_answer})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# End chat session route
@app.route("/end-chat", methods=["POST"])
def end_chat():
    data = request.json
    session_id = data.get("sessionId")
    if not session_id:
        return jsonify({"error": "Missing sessionId"}), 400

    try:
        # Remove session-specific data
        session_vectorstores.pop(session_id, None)
        session_histories.pop(session_id, None)
        return jsonify({"message": "Session ended successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run server
if __name__ == "__main__":
    app.run(port=4000)


