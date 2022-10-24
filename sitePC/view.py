import functools
import traceback
from requests import post

from django.db import transaction
from django.http import JsonResponse


def ret(json_object, status=200):
    return JsonResponse(
        json_object,
        status=status,
        json_dumps_params={"ensure_ascii": False}
    )


def send_message_telegram(message):
    # return
    post("https://api.telegram.org/bot1364558506:AAEq5uwNMtUISLeIFgd61f-QiZRJ4zgo7A0/sendMessage", data={
        "chat_id": 1056465223,
        "text": message,
    })


def error_response(exception):
    res = {"status": "error"}
    print(f"\033[31m{traceback.format_exc()}")
    # send_message_telegram(f"Ошибка {str(exception)}\n{traceback.format_exc()}")
    return ret(res, 400)


def base_view(fn):
    @functools.wraps(fn)
    def inner(request, *args, **kwargs):
        try:
            with transaction.atomic():
                return fn(request, *args, **kwargs)
        except Exception as e:
            return error_response(e)

    return inner
