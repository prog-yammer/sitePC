from datetime import datetime as dt, timedelta as td
from json import loads

from django.views.decorators.csrf import csrf_protect, csrf_exempt

from sitePC.settings import DEBUG
from apps.info.models import Coupons, Players
from apps.info.views import check_player_on_server, check_coupon_discount
from apps.shop.models import Product
from sitePC.view import base_view, ret, send_message_telegram
from .models import Payment
from .paymaster import Paymaster
from .qiwi.Qiwip2p import QiwiP2P

QIWI_PRIV_KEY = "eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6Inhyc" \
                "GZ3Zi0wMCIsInVzZXJfaWQiOiI3OTExODM2MjUzMiIsInNlY3JldCI6IjA0ZDQ1YzFiMDEwN2" \
                "Y2MTlmZWMyNGRlMzNlYThlMGI0MWNmNGUxMGIyZTg2ODViMzRkY2EyNGI1NTNhYjYyMTMifX0="

p2p = QiwiP2P(auth_key=QIWI_PRIV_KEY)
paymaster = Paymaster(site_id="a543bbd5-b471-4065-80f1-d5cb9b40ba1f",
                      secret_key="380567bf7996e7469e3a224b46a230bc7edaba7827d8312e252f2e50a4"
                                 "b0db9e23b023a1cf9472970b38711ff9c46d67c621")


def create_payment_url(payment, pay_type):
    msg = f"Покупка доната [{payment.product}] игроком {payment.player}.\n"
    if payment.coupon is not None:
        msg += "Купон: " + payment.coupon.code + ".\n"
    msg += "Оплатить до " + (dt.now() + td(minutes=1)).strftime("%H:%M:%S %d.%m.%Y") + " МСК"

    res = ""
    # pay_type = pay_type if pay_type in ("") else "qiwi"
    if pay_type == "qiwi":
        bill = p2p.bill(bill_id=payment.id, amount=payment.amount, comment=msg)
        res = bill.pay_url
        payment.payment_method = pay_type
    elif pay_type == "cards":
        res = paymaster.bill(bill_id=payment.id, amount=payment.amount, comment=msg)
        payment.payment_method = pay_type
    else:
        bill = p2p.bill(bill_id=payment.id, amount=payment.amount, comment=msg, pay_type="card")
        res = bill.pay_url
        payment.payment_method = "cards"

    payment.save()
    # else:
    #     res = paymaster.bill(bill_id=payment.id, amount=payment.amount, comment=msg, pay_type=pay_type)
    # timer = Timer(60, error_purchase, args=(payment.id, ))
    # timer.start()

    # elif pay_type == "yoomoney":
    #     pass
    # elif pay_type in ("mts", "megafon", "beeline"):
    #     pass

    send_message_telegram("Платеж создан")
    return res


@base_view
@csrf_protect
def create_payment(request):
    data = {'status': "error"}
    send_message_telegram("Создание платежа!!!")

    if request.method == 'POST':
        json = loads(request.body)
        product = json["id"]
        player_info = check_player_on_server(json["nick"], product)
        if DEBUG:
            player_info[0] = "PCtest"

        if player_info != "-":
            if player_info[1] is False:
                return ret(data)

            product = Product.objects.get(id=product)
            amount = product.price

            if player_info[1] is not True:
                amount -= player_info[1]

            coupon = json["coupon"]
            if coupon != "":
                discount = check_coupon_discount(player_info[0], coupon)

                if discount != "-":
                    amount = int(amount * (100 - discount) / 100)
                    coupon = Coupons.objects.get(code=coupon)

                    if coupon.count != "-":
                        coupon.count = int(coupon.count) - 1
                        coupon.save()
                else:
                    coupon = None
            else:
                coupon = None

            payment = Payment.objects.create(product=product, player=Players.objects.get(nickname=player_info[0]),
                                             coupon=coupon, amount=amount)
            return ret({'status': "success", "url": create_payment_url(payment, json["pay_type"])})

    return ret(data)


@base_view
@csrf_exempt
def qiwi_handler(request):
    send_message_telegram("Запрос на обработчика")
    data = {"error": "digital signature authentication error"}
    if request.method == 'POST':
        body = dict(request.POST)
        # if body == {}:
        #     try:
        #         body = loads(request.body)
        #     except:
        #         body = '{"' + request.body.decode("utf-8").replace("&", '","').replace("=", '":"') + '"}'
        #         body = loads(body)
        #
        # send_message_telegram(f"body: {body}")
        #
        # if body == {}:
        #     body = loads(request.body)
        #     send_message_telegram(f"body: {body}")

        qiwi_check = p2p.qiwi_notify(dict(request.headers), body)
        send_message_telegram(f"qiwi_check: {qiwi_check}")

        if qiwi_check:

            data = {"error": "0"}

            if qiwi_check["status"] != "WAITING":

                if qiwi_check["status"] == "PAID":
                    success_purchase(qiwi_check["id"])
                else:
                    error_purchase(qiwi_check["id"])

                    p2p.reject(qiwi_check["id"])

    return ret(data)


@base_view
@csrf_exempt
def paymaster_handler(request):
    send_message_telegram("Запрос на обработчика")
    data = {"error": "digital signature authentication error"}

    if request.method == 'POST':
        body = dict(request.POST)
        # if body == {}:
        #     try:
        #         body = loads(request.body)
        #     except:
        #         body = '{"' + request.body.decode("utf-8").replace("&", '","').replace("=", '":"') + '"}'
        #         body = loads(body)
        #
        # send_message_telegram(f"body: {body}")
        #
        # if body == {}:
        #     body = loads(request.body)
        #     send_message_telegram(f"body: {body}")

        paymaster_check = paymaster.check(body)
        send_message_telegram(f"paymaster_check: {paymaster_check}")

        if paymaster_check:
            data = {"error": "0"}
            success_purchase(paymaster_check)

    return ret(data)


def success_purchase(payment_id):
    payment = Payment.objects.get(id=payment_id)
    if payment.status == 0:
        payment.status = 1
        payment.save()
        product = payment.product
        command = product.subcategory.command.replace("%player%", payment.player)\
            .replace("%product%", product.name_for_command)
        send_message_telegram(command + " server=" + product.subcategory.category.server_name)

        if payment.coupon is not None:
            coupon = payment.coupon
            if coupon.count == "0":
                coupon.active = False
                coupon.save()
    elif payment.status == -1:
        send_message_telegram("Товар оплачен после истечения времени")


def error_purchase(payment_id):
    payment = Payment.objects.get(id=payment_id)
    if payment.status == 0:
        payment.status = -1
        payment.save()
        send_message_telegram('отмена!!!!')
        if payment.coupon is not None:
            coupon = payment.coupon
            if coupon.count != "-":
                coupon.count = int(coupon.count) + 1
                coupon.save()
