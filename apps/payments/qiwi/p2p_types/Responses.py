from .Errors import QiwiError
from requests import Response
import typing
import json
import time
from . import QiwiCustomer
from . import QiwiDatetime


class Bill:

	def __init__(self, response: typing.Union[Response, dict], qiwi_p2p=None):

		self.r_json = response.json() if type(response) is Response else response

		self.site_id: int = self.r_json["siteId"]
		self.bill_id: int = self.r_json["billId"]
		self.amount: float = self.r_json["amount"]["value"]
		self.currency: str = self.r_json["amount"]["currency"]
		self.status: str = self.r_json["status"]["value"]
		self.status_changed: str = self.r_json["status"]["changedDateTime"]
		self.creation: str = self.r_json["creationDateTime"]
		self.expiration: str = self.r_json["expirationDateTime"]
		self.pay_url: str = self.r_json.get("payUrl")
		self.comment: str = self.r_json["comment"] if "comment" in self.r_json else None
		self.customer: QiwiCustomer = QiwiCustomer(
			json_data=self.r_json["customer"]) if "customer" in self.r_json else None
		self.fields: dict = self.r_json["customFields"] if "customFields" in self.r_json else None
		self.json = self.r_json
		self.__p2p = qiwi_p2p
		self.bill_history = [self]

	@property
	def actual(self):
		"""
		Актуальная информация о счёте, получаемая прямо при вызове.
		Осторожно, каждое обращение к Bill.actual производит обращение к API QiwiP2P.
		Если нет необходимости в постоянном обновлении данных, то рекомендуется воспользоваться методом Bill.update_info().

		В историю Bill.bill_history будет добавлен актуальный Bill. Зачем? Не знаю, пусть будет. Может кому-то пригодится.

		:return: Объект счета с обновленной информацией
		:rtype: Bill
		"""
		if self.__p2p :
			actual = self.get_actual()
			actual.bill_history = self.bill_history
			actual.bill_history.append(actual)
			self.bill_history.append(actual)
			return actual

	def get_actual(self):
		"""
		Возвращает новый экземпляр Bill с актуальной информацией.

		:return: Объект счета с обновленной информацией
		:rtype: Bill
		"""
		if self.__p2p:
			return self.__p2p.check(self.bill_id)

	def update_info(self):
		"""
		Изменяет текущий экземпляр Bill, устанавливая актуальную информацию.

		:return: Объект счета с обновленной информацией
		:rtype: Bill
		"""
		actual = self.get_actual()
		actual.bill_history = self.bill_history
		actual.bill_history.append(actual)
		self.__dict__ = actual.__dict__
		return self
