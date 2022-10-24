from django.contrib import admin
from .models import *


class CouponsAdmin(admin.ModelAdmin):
    list_display = ['code', 'nickname', 'discount', 'active', 'valid_to']


class ImagesAdmin(admin.ModelAdmin):
    list_display = ['number', 'image']
    list_display_links = ['image']
    list_editable = ['number']


class PlayersAdmin(admin.ModelAdmin):
    list_display = ['nickname', 'vk', 'vk_name', "add_date"]
    search_fields = ['nickname', 'vk', 'vk_name']
    # readonly_fields = ['nickname', 'vk', 'vk_name']

    # def has_delete_permission(self, request, obj=None):
    #     return False
    #
    # def has_add_permission(self, request):
    #     return False


class MenuLinksAdmin(admin.ModelAdmin):
    list_display = ['number', 'name', 'link']
    list_editable = ['number']
    list_display_links = ['name']


class SiteMessagesAdmin(admin.ModelAdmin):
    list_display = ['sm_name', 'name', 'text']
    search_fields = ['name', 'text']
    # readonly_fields = ['sm_name', ]
    # list_display_links = ['name']

    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)

        default = {
            "metaDesc": "Описание сайта",
            "title": "Заголовок",
            "leftWords": "Слова слева",
            "IP": "IP сервера",
            "rightWords": "Слова справа",
            "currency": "Валюта",
            "footer": "Нижняя инфа",
            "title_rules": "Заголовок для правил",
            "title_public-offer": "Заголовок для публичной оферты",
            "title_privacy": "Заголовок для политики обработки перс данных",
        }

        s = SiteMessages.objects.all()
        if [i.sm_name for i in s] != list(default.keys()):
            texts = {sm_name: "" for sm_name in default.keys()}
            for i in s:
                texts[i.sm_name] = i.text

            SiteMessages.objects.all().delete()

            for i in default.keys():
                SiteMessages.objects.create(sm_name=i, name=default[i], text=texts[i])


admin.site.register(Coupons, CouponsAdmin)
admin.site.register(Images, ImagesAdmin)
admin.site.register(Players, PlayersAdmin)
admin.site.register(MenuLinks, MenuLinksAdmin)
admin.site.register(SiteMessages, SiteMessagesAdmin)
