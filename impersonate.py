from web3 import Web3, HTTPProvider


def impersonate_account(web3: Web3, address: str):
    """
    Impersonate account through Anvil without needing private key
    :param address:
        Account to impersonate
    """
    web3.provider.make_request("anvil_impersonateAccount", [address])


if __name__ == "__main__":
  PROVIDER = "https://ethereum-rpc.publicnode.com/"
  web3 = Web3(HTTPProvider(PROVIDER))
  impersonate_account(web3, "0x2B384212EDc04Ae8bB41738D05BA20E33277bf33")
