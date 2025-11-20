import logging

import json
import websockets

import lighter


def trim_exception(e: Exception) -> str:
    return str(e).strip().split("\n")[-1]


def save_api_key_config(base_url, api_key_private_key, account_index, api_key_index, config_file="./api_key_config.json"):
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump({
            "baseUrl": base_url,
            "apiKeyPrivateKey": api_key_private_key,
            "accountIndex": account_index,
            "apiKeyIndex": api_key_index,
        }, f, ensure_ascii=False, indent=2)


def get_api_key_config(config_file="./api_key_config.json"):
    with open(config_file) as f:
        cfg = json.load(f)

    return cfg["baseUrl"], cfg["apiKeyPrivateKey"], cfg["accountIndex"], cfg["apiKeyIndex"]


def default_example_setup(config_file="./api_key_config.json") -> (lighter.ApiClient, lighter.SignerClient, websockets.ClientConnection):
    logging.basicConfig(level=logging.DEBUG)

    base_url, api_key_private_key, account_index, api_key_index = get_api_key_config(config_file)
    api_client = lighter.ApiClient(configuration=lighter.Configuration(host=base_url))
    client = lighter.SignerClient(
        url=base_url,
        private_key=api_key_private_key,
        account_index=account_index,
        api_key_index=api_key_index,
    )

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {trim_exception(err)}")
        return

    return client, api_client, websockets.connect(f"{base_url.replace('https', 'wss')}/stream")
