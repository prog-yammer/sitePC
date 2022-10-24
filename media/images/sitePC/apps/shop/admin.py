from django.contrib import admin
from .models import Category, Product, Subcategory


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'number', 'server_name']


class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['category', 'name', 'number', 'check_to_buy', 'command']


class ProductAdmin(admin.ModelAdmin):
    list_display = ['category', 'subcategory', 'name', 'price', 'created', 'edited']
    # ordering = ["id", "subcategory", "price"]

    def category(self, product):
        return product.subcategory.category

    category.short_description = 'Категория'
    # category.admin_order_field = 'name'


admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Product, ProductAdmin)
