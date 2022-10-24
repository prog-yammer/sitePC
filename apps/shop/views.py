from django.shortcuts import render, redirect
from django.template.loader import render_to_string, get_template
from django.views.decorators.csrf import csrf_protect, csrf_exempt

from .models import Category, Subcategory, Product
from apps.info.models import Images, MenuLinks, SiteMessages
from apps.info.views import mine
from sitePC.view import base_view, ret


@base_view
@csrf_exempt
def main(request, info_content=None):
    msg = {s.sm_name: s.text for s in SiteMessages.objects.all()}

    if info_content:
        content = info_content[0]
        msg["title"] = info_content[1]

    else:
        p = Product.objects.all()
        products = {}
        for i in p:
            products.update({
                i.id: {
                    "name": i.name,
                    "desc": i.description,
                    "price": i.price,
                }
            })

        data_shop = {
            "categories": Category.objects.all(),
            "subcategories": Subcategory.objects.all(),
            "products": p,
            "online": mine("bungee"),
            "info": products,
            "messages": msg,
        }
        content = render_to_string("shop/main.html", data_shop)
        if request.method == "POST":
            return ret({"html": content, "title": msg["title"]})

    data = {
        "images": Images.objects.all(),
        "links": MenuLinks.objects.all(),
        "messages": msg,
        "content": content,
    }

    return render(request, 'base.html', data)


@base_view
@csrf_exempt
def other(request, pk):
    try:
        title = SiteMessages.objects.get(sm_name=f"title_{pk}").text
        if request.method == "GET":
            return main(request, [render_to_string(f"info/{pk}.html"), title])

        return ret({"title": title,
                    "html": render_to_string(f"info/{pk}.html")})
    except SiteMessages.DoesNotExist as e:
        if request.method == "GET":
            return redirect("/")
        return ret({"html": None})
