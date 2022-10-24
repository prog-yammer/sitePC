from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from telebot import TeleBot

from apps.info.models import Coupons, Players
from apps.info.views import check_player_on_server, check_coupon_discount
from .models import Payment
from apps.shop.models import Product

from .qiwi.Qiwip2p import QiwiP2P
from .paymaster import Paymaster

from datetime import datetime as dt, timedelta as td
from json import loads
from threading import Timer

QIWI_PRIV_KEY = "eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InhycGZ3Zi0wMCIsInVzZXJfaWQiOi" \
                "I3OTExODM2MjUzMiIsInNlY3JldCI6IjM2MzE3OGY5Y2EzMTgzOTBkN2FjOGI0M2Y1ZWE3YzNmNzU3ZGQxM2JjODBlMGJlY2Qy" \
                "ZjkxNjc2NjhjM2Y2MDgifX0="

p2p = QiwiP2P(auth_key=QIWI_PRIV_KEY)
paymaster = Paymaster(site_id="", secret_key="")

bot = TeleBot("1364558506:AAEq5uwNMtUISLeIFgd61f-QiZRJ4zgo7A0")


def create_payment_url(payment, pay_type):
    msg = f"Покупка доната [{payment.product}] игроком {payment.player}.\n"
    if payment.coupon is not None:
        msg += "Купон: " + payment.coupon.code + ".\n"
    msg += "Оплатить до " + (dt.now() + td(minutes=1)).strftime("%H:%M:%S %d.%m.%Y")

    res = ""
    # pay_type = pay_type if pay_type in ("") else "qiwi"
    if pay_type == "qiwi":
        bill = p2p.bill(bill_id=payment.id, amount=payment.amount, comment=msg)
        res = bill.pay_url
        payment.payment_method = pay_type
    # elif pay_type == "cards":
    else:
        bill = p2p.bill(bill_id=payment.id, amount=payment.amount, comment=msg, pay_type="card")
        res = bill.pay_url
        payment.payment_method = "cards"

    payment.save()
    # else:
    #     res = paymaster.bill(bill_id=payment.id, amount=payment.amount, comment=msg, pay_type=pay_type)
    #     timer = Timer(600, error_purchase, args=payment.id)
    #     timer.start()

    # elif pay_type == "yoomoney":
    #     pass
    # elif pay_type in ("mts", "megafon", "beeline"):
    #     pass

    send_message_telegram("Платеж создан")
    return res


@csrf_protect
def create_payment(request):
    data = {'status': "error"}

    # try:
    if request.method == 'POST':
        json = loads(request.body)
        product = json["id"]
        player_info = check_player_on_server(json["nick"], product)

        if player_info != "-":
            if player_info[1] is False:
                return JsonResponse(data)

            product = Product.objects.get(id=product)
            amount = product.price

            if player_info[1] is not True:
                amount -= player_info[1]

            coupon = json["coupon"]
            if coupon is not None:
                discount = check_coupon_discount(player_info[0], coupon)

                if discount != "-":
                    amount = int(amount * (100 - discount) / 100)
                    coupon = Coupons.objects.get(code=coupon)

                    if coupon.count != "-":
                        coupon.count = int(coupon.count) - 1
                        coupon.save()
                else:
                    coupon = None

            payment = Payment.objects.create(product=product, player=Players.objects.get(nickname=player_info[0]),
                                             coupon=coupon, amount=amount)
            return JsonResponse({'status': "success", "url": create_payment_url(payment, json["type"])})

    return JsonResponse(data)


# except:
#     return JsonResponse(data)


@csrf_exempt
def qiwi_handler(request):
    send_message_telegram("Запрос на обработчика")
    data = {"error": "digital signature authentication error"}
    try:
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

        return JsonResponse(data)
    except Exception as e:
        send_message_telegram("Ошибка " + repr(e))
        return JsonResponse(data)


@csrf_exempt
def paymaster_handler(request):
    send_message_telegram("Запрос на обработчика")
    data = {"error": "digital signature authentication error"}
    try:
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

        return JsonResponse(data)

    except Exception as e:
        send_message_telegram("Ошибка " + repr(e))
        return JsonResponse(data)


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


def send_message_telegram(message):
    bot.send_message(1056465223, message)
