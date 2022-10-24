import datetime as dt

# from django.shortcuts import render
from re import findall

from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Sum
from django.views.decorators.csrf import csrf_protect
from mcipc.query import Client

from sitePC.settings import SERVERS
from .models import Players, Coupons
from apps.shop.models import Product
from apps.payments.models import Payment

import qsstats
import mysql.connector
from json import loads
from time import sleep
from mcipc.mcrcon import MCRcon


def stats():
    ans = {}
    pl = Players.objects.all()
    task = qsstats.QuerySetStats(pl, date_field="add_date", today=dt.date.today())
    task = task.time_series(pl[0].add_date)
    ans["values1"] = task

    p = Payment.objects.filter(status=1)
    task = qsstats.QuerySetStats(p, date_field="closed_date", today=dt.date.today(), aggregate=Sum("amount"))
    task = task.time_series(p[0].closed_date)
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
            server = SERVERS[server_name]
            with Client(server[0], server[1], timeout=5) as client:
                basic_stats = client.stats()
                return f"{basic_stats.num_players}/{basic_stats.max_players}"

        rcon = SERVERS[server_name]
        with MCRcon(rcon[0], rcon[2], port=rcon[1]) as mcr:
            return mcr.command(command).strip()

    except:
        return "error"


@csrf_protect
def get_online(request):
    data = {'status': "error"}

    if request.method == "POST":
        data = {"status": "success", "online": mine("bungee")}

    return JsonResponse(data)


def check_possibility(check_args, player, server):
    db = mysql.connector.connect(
        host="pei17y9c5bpuh987.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
        user="vebcx6alf7p8ng16",
        passwd="y0kobo6m7fqt4mir",
        database="p8m4h6gxrc6o0sx1"
    )
    cursor = db.cursor()

    answer = False
    cursor.execute(f"SELECT uuid FROM luckperms_players WHERE username = '{player}'")
    uuid = cursor.fetchone()[0]
    if check_args[0] == "have_more":
        answer = 0
        cursor.execute(f"SELECT permission FROM luckperms_user_permissions WHERE uuid = '{uuid}' " +
                       f"AND permission LIKE 'group%' AND server = '{server}'")
        perm = cursor.fetchone()
        if perm:
            if perm[0] != "group.default":
                answer = perm[0].replace("group.", "")

    elif check_args[0] == "have":
        cursor.execute(f"SELECT * FROM luckperms_user_permissions WHERE uuid = '{uuid}' " +
                       f"AND permission = '{check_args[1]}' AND server = '{server}'")
        answer = not bool(cursor.fetchone())
    cursor.close()
    db.close()
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
                check_args = check_args.replace("%product%", product.name_for_command)
                answer = check_possibility(check_args.split(" "), player.lower(),
                                           product.subcategory.category.server_name)
                if answer not in (False, True, 0):
                    answer = Product.objects.get(name_for_command=answer).price

            return player, answer
    return "-"


@csrf_protect
def check_player(request):
    sleep(2)
    data = {'status': "error", "message": "not found"}
    # try:
    if request.method == 'POST':
        json = loads(request.body)
        print(json)
        nick = json["nick"]
        result = check_player_on_server(nick, json["id"])
        if result != "-":
            data = {"status": "success", "nick": result[0], "possibility": result[1]}
    # except:
    #     pass
    return JsonResponse(data)


def check_coupon_discount(nick, code):
    now = timezone.now()
    coupon = Coupons.objects.filter(code__exact=code, active=True, valid_from__lte=now)
    if coupon:
        coupon = coupon[0]
        if now <= coupon.valid_to:
            if coupon.nickname in (nick, "-") and coupon.count != "0":
                vk = Players.objects.filter(nickname__iexact=nick)[0].vk
                if vk == "0" or vk.startswith("_") or vk.startswith("-"):
                    return "-"
            else:
                return "-"
        else:
            coupon.active = False
            coupon.save()
            return "-"
        print(coupon.discount)
        return coupon.discount

    else:
        return "-"


# не забудь в mysql поставить utf8_bin
@csrf_protect
def check_coupon(request):
    data = {'status': "error"}

    # try:
    if request.method == 'POST':
        json = loads(request.body)
        discount = check_coupon_discount(json["nick"], json["code"])
        if discount != "-":
            data = {'status': "success", "code": json["code"], "discount": discount}

        return JsonResponse(data)

    # except:
    #     return JsonResponse(data)
