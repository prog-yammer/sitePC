from django.contrib import admin
from django.utils.html import format_html

from .models import (Category, Subcategory, Product)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'server_name')


class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'name', 'check_to_buy', 'command')


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'subcategory', 'name', 'price', 'created', 'edited', 'image_tag')

    def image_tag(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" height="100" />')
        return '-'
    image_tag.short_description = 'Изображение'


admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Product, ProductAdmin)