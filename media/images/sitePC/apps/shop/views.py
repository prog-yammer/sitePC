from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.template.loader import render_to_string, get_template
from django.views.decorators.csrf import csrf_protect, csrf_exempt

from .models import Category, Subcategory, Product
from apps.info.models import Images, MenuLinks, SiteMessages
from apps.info.views import mine


@csrf_exempt
def main(request, pk=None):
    print(5)
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

    data = {
        "categories": Category.objects.all(),
        "subcategories": Subcategory.objects.all(),
        "products": p,
        "online": mine("bungee"),
        "info": products,
        "images": Images.objects.all(),
        "links": MenuLinks.objects.all(),
        "messages": {s.sm_name: s.text for s in SiteMessages.objects.all()},
    }

    if pk:
        data["info__content"] = pk[0]
        data["messages"]["title"] += "%PC%" + pk[1]

    return render(request, 'shop/main.html', data)


@csrf_exempt
def other(request, pk):
    try:
        title = SiteMessages.objects.get(sm_name=f"title_{pk}").text
        if request.method == "GET":
            return main(request, [render_to_string(f"info/{pk}.html"), title])

        return JsonResponse({"title": title,
                             "html": render_to_string(f"info/{pk}.html")})
    except:
        if request.method == "GET":
            return redirect("/")
        return JsonResponse({"html": None})
