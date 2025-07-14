import requests
import fitz  # PyMuPDF

pdf_url = "https://res.cloudinary.com/dukwtk6b6/raw/upload/v1747678597/pitch_decks/pitch_1747678597835.pdf"

headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(pdf_url, headers=headers)

if response.status_code != 200:
    print("Failed to fetch PDF:", response.status_code)
else:
    pdf_bytes = response.content
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        print("Extracted text:\n", full_text)
    except Exception as e:
        print("Failed to read PDF:", str(e))
