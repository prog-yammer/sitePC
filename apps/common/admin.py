from django.contrib import admin
from django.utils.html import format_html

from .models import BackgroundImage, MenuLinks


class BackgroundImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image_tag')

    def image_tag(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" height="100" />')
        return '-'

    image_tag.short_description = 'Изображение'


class MenuLinksAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'link_tag')
    # list_editable = ('name',)
    # list_display_links = ('name',)

    def link_tag(self, obj):
        if obj.link:
            return format_html(f'<a href="{obj.link}">{obj.link}</a>')
        return '-'

    link_tag.short_description = 'Ссылка'


admin.site.register(BackgroundImage, BackgroundImageAdmin)
admin.site.register(MenuLinks, MenuLinksAdmin)
