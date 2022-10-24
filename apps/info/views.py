import datetime as dt
# from django.shortcuts import render
import hashlib
import random
from json import loads
from random import choice, randint
from time import sleep

import qsstats
from django.db.models import Sum
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from mcstatus import JavaServer
from mcstatus.mcrcon import MCRcon

from apps.payments.models import Payment
from apps.shop.models import Product
from sitePC.settings import SERVERS, DEBUG
from sitePC.view import base_view, ret
from .models import Players, Coupons


def stats():
    ans = {}
    pl = Players.objects.all()
    task = qsstats.QuerySetStats(pl, date_field="add_date", today=dt.date.today())
    if pl:
        start_date = pl[0].add_date
    else:
        start_date = dt.datetime.now()
    task = task.time_series(start_date)
    ans["values1"] = task

    p = Payment.objects.filter(status=1)
    task = qsstats.QuerySetStats(p, date_field="closed_date", today=dt.date.today(), aggregate=Sum("amount"))
    if p:
        start_date = p[0].add_date
    else:
        start_date = dt.datetime.now()
    task = task.time_series(start_date)
    ans["values2"] = task

    ans["values3"] = []
    for i in Payment.PAYMENT_METHOD:
        ans["values3"].append([i[1], p.filter(payment_method=i[0]).count()])

    count = 0
    for i in pl:
        try:
            int(i.vk)
            count += 1
        except ValueError:
            pass
    ans["values4"] = [("Привязана", count), ("Не привязана", pl.count() - count)]

    ans["values5"] = []
    task = []
    for i in p:
        c = i.coupon
        if c is not None:
            task.append(str(c.discount) + "%")
        else:
            task.append("0")

    for i in sorted(set(task)):
        ans["values5"].append([i, task.count(i)])

    return ans


def mine(server_name: str, command: str = None):
    try:
        if server_name == "bungee":
            server = JavaServer.lookup(SERVERS[server_name]).query()
            return f"{server.players.online}/{server.players.max}"

        rcon = SERVERS[server_name]
        with MCRcon(rcon[0], rcon[2], port=rcon[1]) as mcr:
            return mcr.command(command).strip()

    except:
        return "0"


@csrf_protect
def get_online(request):
    data = {'status': "error"}

    if request.method == "POST":
        data = {"status": "success", "online": mine("bungee")}

    return ret(data)


def check_possibility(check_args, player, server):
    answer = False
    if check_args[0] == "have_more":
        answer = 0
        perm = loads(mine("lobby", f"pclp have_more {player} {server}"))["result"]

        if perm:
            if "default" not in perm:
                answer = perm

    elif check_args[0] == "have":
        answer = not loads(mine("lobby", f"pclp have {player} {server} {check_args[1]}"))["result"]

    return answer


def check_player_on_server(nick, product):
    player = Players.objects.filter(nickname__iexact=nick)
    if player:
        answer = True
        player = player[0].nickname
        product = Product.objects.filter(id=product)
        if product:
            product = product[0]
            check_args = product.subcategory.check_to_buy
            if check_args != "-":
                answer = check_possibility([check_args, product.name_for_command], player,
                                           product.subcategory.category.server_name)
                if answer not in (False, True, 0):
                    answer = Product.objects.get(name_for_command=answer).price

            return player, answer
    elif DEBUG:
        return [nick, product]
    return "-"


@base_view
@csrf_protect
def check_player(request):
    data = {'status': "error", "message_error": "not found"}
    if request.method == 'POST':
        json = loads(request.body)
        nick = json["nick"]
        result = check_player_on_server(nick, json["id"])
        if result != "-":
            data = {"status": "success", "nick": result[0], "possibility": result[1]}

    return ret(data)


def check_coupon_discount(nick, code):
    now = timezone.now()
    coupon = Coupons.objects.filter(code__exact=code, active=True, valid_from__lte=now)
    if coupon:
        coupon = coupon[0]
        if now <= coupon.valid_to:
            if coupon.nickname == nick and coupon.count != "0":
                vk = Players.objects.filter(nickname__iexact=nick)[0].vk
                if vk == "0" or vk.startswith("_") or vk.startswith("-"):
                    return "-"
            elif coupon.nickname != "-" or coupon.count == "0":
                return "-"
        else:
            coupon.active = False
            coupon.save()
            return "-"
        return coupon.discount

    else:
        return "-"


# не забудь в mysql поставить utf8_bin
@base_view
@csrf_protect
def check_coupon(request):
    data = {'status': "error"}

    if request.method == 'POST':
        json = loads(request.body)
        discount = check_coupon_discount(json["nick"], json["code"])
        if discount != "-":
            data = {'status': "success", "code": json["code"], "discount": discount}

    return ret(data)


@base_view
@csrf_exempt
def api(request):
    data = loads(request.body.decode("utf-8"))
    sk = "q#fIdrzWkTPvqqNIuSKbAmxRdPOh!Y%0YAycrQJgXw@0KPde3UNOC47*7&qkHEDhaqX8us"
    sha256 = hashlib.sha256(f"{data['type']} % {data['obj']} % {data['data']} % {sk}".encode()).hexdigest()
    if sha256 != data["access_token"]:
        return ret({"status": "error", "answer": "no access"})

    if data["obj"] == "coupon" and data["type"] == "add":
        data = loads(data["data"].replace("'", '"'))
        player = Players.objects.get(nickname=data["nick"])

        while True:
            code = ""
            for i in range(randint(5, 7)):
                code += choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
            if len(Coupons.objects.filter(code=code)) == 0:
                break

        Coupons.objects.create(code=code, nickname=player.nickname, discount=data["discount"], count=1)

        return ret({"status": "success", "answer": player.vk_name})

    elif data["obj"] == "player":
        data_player = loads(data["data"].replace("'", '"'))
        player = Players.objects.filter(nickname=data_player["nick"])

        if data["type"] == "add":
            if len(player) == 0:
                Players.objects.create(nickname=data_player["nick"])

            return ret({"status": "success", "answer": data_player["nick"]})

        player = player[0]
        if data["type"] == "get":
            return ret({"status": "success", "answer": player.vk_name})

        elif data["type"] == "acceptVK":
            vk = player.vk_name.split("_")
            player.vk = vk[0]
            player.vk_name = vk[1]
            player.save()
            return ret({"status": "success"})

        elif data["type"] == "rejectVK":
            player.vk_name = "-"
            player.save()
            return ret({"status": "success"})

        elif data["type"] == "create/get_secret":
            secret = player.vk
            if secret == "-":
                while True:
                    secret = ""
                    for i in range(5):
                        secret += choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
                    if len(Players.objects.filter(vk=secret)) == 0:
                        break

            player.vk = secret
            player.save()
            return ret({"status": "success", "answer": secret})

    return ret({"status": "error"})
