import datetime as dt
import hashlib
import hmac

import requests


class Paymaster:

    def __init__(self, site_id: str, secret_key: str):
        self.site_id = site_id

    def bill(self,
             bill_id: int,
             amount: int,
             lifetime: int = 1,
             comment: str = "",
             pay_type: str = "WebMoney"):
        paymaster_request_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        paymaster_request_data = {
            "LMI_MERCHANT_ID": self.site_id,
            "LMI_PAYMENT_AMOUNT": str(amount),
            "LMI_CURRENCY": "RUB",
            "LMI_PAYMENT_NO": str(bill_id),
            "LMI_PAYMENT_DESC": comment,

            "LMI_SIM_MODE": "0",

            "LMI_EXPIRES": (dt.datetime.now(dt.timezone.utc) +
                            dt.timedelta(minutes=lifetime)).strftime("%Y-%m-%dT%H:%M:%S"),
            "LMI_PAYMENT_METHOD": "[" + pay_type + "]",
        }

        paymaster_raw_response = requests.post(f"https://paymaster.ru/payment/init",
                                               json=paymaster_request_data, headers=paymaster_request_headers)
        return paymaster_raw_response.url

    def check(self, data):

        data["LMI_SIM_MODE"] = "" if data.get("LMI_SIM_MODE") is None else data["LMI_SIM_MODE"]
        invoice_parameters = f'{data["LMI_MERCHANT_ID"]};{data["LMI_PAYMENT_NO"]};{data["LMI_SYS_PAYMENT_ID"]};{data["LMI_SYS_PAYMENT_DATE"]};{data["LMI_PAYMENT_AMOUNT"]};{data["LMI_CURRENCY"]};{data["LMI_PAID_AMOUNT"]};{data["LMI_PAID_CURRENCY"]};{data[{"LMI_PAYMENT_SYSTEM"}]};{data["LMI_SIM_MODE"]};{self.secret_key}'
        sha256 = hmac.new(invoice_parameters.encode(), hashlib.sha256).hexdigest()

        if sha256 == data["LMI_HASH"]:
            return data["LMI_PAYMENT_NO"]
        else:
            return False
