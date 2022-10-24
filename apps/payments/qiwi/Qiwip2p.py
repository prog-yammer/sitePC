import hashlib
import hmac
import typing
import requests

from .p2p_types.Responses import Bill
from .p2p_types import QiwiDatetime


class QiwiP2P:

    def __init__(self, auth_key: str, default_amount: int = 100, currency: str = "RUB"):
        self.auth_key = auth_key
        self.default_amount = default_amount
        self.currency = currency

    def bill(self,
             bill_id: typing.Union[str, int],
             amount: int,
             lifetime: int = 10,
             comment: str = "",
             pay_type: str = "qw"):
        amount = str(amount)
        currency = self.currency
        qiwi_request_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.auth_key}"
        }
        qiwi_request_data = {
            "amount": {
                "currency": currency,
                "value": amount
            },
            "comment": comment,
            "expirationDateTime": QiwiDatetime(lifetime=lifetime).qiwi,
            "customer": {},
            "customFields": {"paySourcesFilter": pay_type}
        }

        qiwi_raw_response = requests.put(f"https://api.qiwi.com/partner/bill/v1/bills/{'TEST-' + str(bill_id)}",
                                         json=qiwi_request_data, headers=qiwi_request_headers)

        qiwi_response = Bill(qiwi_raw_response, self)
        return qiwi_response

    def check(self, bill_id: typing.Union[str, int]):
        qiwi_request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.auth_key}"
        }

        qiwi_raw_response = requests.get(f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}",
                                         headers=qiwi_request_headers)
        qiwi_response = Bill(qiwi_raw_response, self)
        return qiwi_response

    def reject(self, bill_id: typing.Union[str, int]):
        qiwi_request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.auth_key}"
        }
        qiwi_raw_response = requests.post(f"https://api.qiwi.com/partner/bill/v1/bills/{bill_id}/reject",
                                          headers=qiwi_request_headers)
        qiwi_response = Bill(qiwi_raw_response, self)
        return qiwi_response

    def qiwi_notify(self, headers: dict, body):

        if (headers.get("Content-Type") == "application/json") and ("X-Api-Signature-Sha256" in headers):
            bill = Bill(body["bill"])

            invoice_parameters = f"{bill.currency} | {bill.amount} | {bill.bill_id} | {bill.site_id} | {bill.status}"
            sha256 = hmac.new(self.auth_key.encode(), invoice_parameters.encode(), hashlib.sha256).hexdigest()
            if sha256 == headers["X-Api-Signature-Sha256"]:
                return {"status": bill.status, "id": bill.bill_id}

        return False
