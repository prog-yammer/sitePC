import datetime as dt
import hashlib
from json import loads
import hmac

import requests


class Paymaster:

    def __init__(self, site_id: str, secret_key: str):
        self.site_id = site_id
        self.secret_key = secret_key

    def bill(self,
             bill_id: [int, str],
             amount: int,
             lifetime: int = 1,
             comment: str = "",
             pay_type: str = "BankCard"):
        paymaster_request_headers = {
            "Authorization": f"Bearer {self.secret_key}",
            # "Idempotency-Key": "86cf125c",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        paymaster_request_data = {
            "merchantId": self.site_id,
            "amount": {
                "value": amount,
                "currency": "RUB"
            },
            "invoice": {
                "description": comment,
                "orderNo": str(bill_id),
                # "expires": (dt.datetime.now(dt.timezone.utc) +
                #             dt.timedelta(minutes=lifetime)).strftime("%Y-%m-%dT%H:%M:%S") + "+03:00",
            },
            "paymentMethod": pay_type,
            "testMode": True,
        }
        paymaster_raw_response = requests.post("https://paymaster.ru/api/v2/invoices",
                                               json=paymaster_request_data, headers=paymaster_request_headers)

        return loads(paymaster_raw_response.content)["url"]
        # return "/"

    def check(self, data):

        data["LMI_SIM_MODE"] = "" if data.get("LMI_SIM_MODE") is None else data["LMI_SIM_MODE"]
        invoice_parameters = f'{data["LMI_MERCHANT_ID"]};{data["LMI_PAYMENT_NO"]};{data["LMI_SYS_PAYMENT_ID"]};{data["LMI_SYS_PAYMENT_DATE"]};{data["LMI_PAYMENT_AMOUNT"]};{data["LMI_CURRENCY"]};{data["LMI_PAID_AMOUNT"]};{data["LMI_PAID_CURRENCY"]};{data[{"LMI_PAYMENT_SYSTEM"}]};{data["LMI_SIM_MODE"]};{self.secret_key}'
        sha256 = hashlib.sha256(invoice_parameters.encode()).hexdigest()

        if sha256 == data["LMI_HASH"]:
            return data["LMI_PAYMENT_NO"]
        else:
            return False


if __name__ == "__main__":
    paymaster = Paymaster(site_id="a543bbd5-b471-4065-80f1-d5cb9b40ba1f",
                          secret_key="380567bf7996e7469e3a224b46a230bc7edaba7827d8312e252f2e50a4"
                                     "b0db9e23b023a1cf9472970b38711ff9c46d67c621")
    print(paymaster.bill("FIRSTTEST2", 100, 10, "ПЕРВЫЙ ТЕСТ"))
