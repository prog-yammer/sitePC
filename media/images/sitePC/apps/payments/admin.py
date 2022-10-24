from django.contrib import admin
from .models import Payment


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'player', 'coupon', 'amount', "status", 'created_date', 'closed_date']
    # readonly_fields = ['id', 'product', 'player', 'coupon', 'amount', "status"]
    #
    # def has_add_permission(self, request):
    #     return False
    #
    # def has_delete_permission(self, request, obj=None):
    #     return False


admin.site.register(Payment, PaymentAdmin)
