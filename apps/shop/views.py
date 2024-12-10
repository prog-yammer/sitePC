import json
import typing as tp
from dataclasses import dataclass, asdict
from time import sleep

from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView

from apps.shop.models import Product, Category, Subcategory
from sitePC.utils.split_view import SplitView


class Main(SplitView):
    template_name = 'shop/index.html'

    def context_data(self, request: HttpRequest) -> tp.Dict[str, tp.Any]:
        return {
            'categories': Category.objects.all(),
            'subcategories': Subcategory.objects.all(),
            'products': Product.objects.all(),
        }


@dataclass
class InputParams:
    id: int
    nickname: str
    coupon: str
    pay_method: str = ''

@dataclass
class Result:
    available: bool = True
    price: int = 0
    sale: str = ''
    bill: str = ''

@method_decorator(csrf_exempt, name='dispatch')
class Api(View):
    PAY_METHODS = {
        'mir': 'Банковская карта ("Мир", а есть еще варианты?)',
        'sbp': 'Спб (КуАр-кодик такой приятный, чтоб ты кэшбек не получал)',
        't-pay': 'Т (Тинькофф) Пэй (кому-то: "супер гуд", кому-то: "сомнительно, но окэй")',
        'yandex-pay': 'Яндекс Пэй (ладно, ни в чем себе не отказывай)',
        'yoomoney': 'ЮМани (эээээ, я чего-то не понял)',
    }

    @csrf_exempt
    def post(self, request: HttpRequest, pk: str, *args, **kwargs) -> HttpResponse:
        return getattr(self, pk)(request)

    def get_price(self, request: HttpRequest) -> HttpResponse:
        sleep(2)
        data = json.loads(request.body)
        input_params = InputParams(**data)

        result = self.input_params_handler(input_params)
        return JsonResponse(asdict(result))

    def get_bill(self, request: HttpRequest) -> HttpResponse:
        data = json.loads(request.body)
        input_params = InputParams(**data)

        result = self.input_params_handler(input_params)

        bill_parts = [
            f"Наименование товара: {Product.objects.get(id=input_params.id).name}",
            f"Никнейм покупателя: {input_params.nickname}",
            f"Сумма к оплате: {result.price}",
            f"Способ оплаты: {self.PAY_METHODS[input_params.pay_method]}",
        ]

        if input_params.coupon:
            bill_parts.insert(3, f'Примененный купон: "{input_params.coupon}" на скидку {result.sale}')

        result.bill = '\n'.join(bill_parts)

        return JsonResponse(asdict(result))

    def input_params_handler(self, input_params: InputParams) -> Result:
        result = Result()
        price = Product.objects.get(id=input_params.id).price
        result.price = price

        if input_params.nickname == 'bad':
            result.available = False
        elif input_params.nickname == 'error':
            raise RuntimeError()

        if input_params.coupon == "sale":
            result.price = round(price * 0.8)
            result.sale = "20%"

        return result