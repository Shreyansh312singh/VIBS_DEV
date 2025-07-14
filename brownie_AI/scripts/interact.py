from brownie import DynamicUsdPayment, accounts

def main():
    account = accounts.load("deployer")
    contract = DynamicUsdPayment[-1]

    print("Creating request...")
    tx = contract.createRequest(7500, {"from": account})  # $75
    tx.wait(1)

    print("Request created!")

    #print("Request details:", contract.getRequest(0))
    print("ETH required:", contract.getEthAmount(7500))
