from django.contrib import admin

from sitePC.settings import DEBUG
from .models import Payment


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'player', 'coupon', 'amount', "status", 'created_date', 'closed_date']
    if not DEBUG:
        readonly_fields = ['id', 'product', 'player', 'coupon', 'amount', "status"]

    def has_add_permission(self, request):
        return DEBUG

    def has_delete_permission(self, request, obj=None):
        return DEBUG


admin.site.register(Payment, PaymentAdmin)
