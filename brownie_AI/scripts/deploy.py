from brownie import DynamicUsdPayment, network, config

from brownie import accounts, network, config

import os
from dotenv import load_dotenv
load_dotenv()


def get_account():
    if network.show_active() in ["sepolia"]:
        return accounts.load("deployer")  # from saved private key
    return accounts[0]


def main():
    account = get_account()
    price_feed_address = config["networks"][network.show_active()]["eth_usd_price_feed"]
    contract = DynamicUsdPayment.deploy(price_feed_address, {"from": account})
    print(f"Contract deployed to {contract.address}")
    return contract
