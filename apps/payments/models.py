from django.db import models

from apps.info.models import Coupons, Players
from apps.shop.models import Product


class Payment(models.Model):
    STATUSES = (
        (-1, "Платёж отменён❌"),
        (0, "Ожидается оплата⏳"),
        (1, "Платёж совершён✅"),
    )

    PAYMENT_METHOD = {
        ("cards", "Карты"),
        ("qiwi", "Qiwi"),
        ("mobile", "Мобильный счет"),
    }

    product = models.ForeignKey(Product, verbose_name='Товар', related_name='product',
                                on_delete=models.PROTECT)
    player = models.ForeignKey(Players, verbose_name='Игрок', related_name='player',
                               on_delete=models.PROTECT)
    coupon = models.ForeignKey(Coupons, verbose_name='Купон', related_name='coupon',
                               on_delete=models.PROTECT, null=True, blank=True)
    amount = models.IntegerField("Размер")
    get_mount = models.IntegerField("Полученные деньги", default=0)
    payment_method = models.CharField("Способ оплаты", max_length=20, default="cards", choices=PAYMENT_METHOD)
    created_date = models.DateTimeField("Время создания", auto_now_add=True)
    closed_date = models.DateTimeField("Время закрытия", auto_now=True)
    status = models.IntegerField("Статус", default=0, choices=STATUSES)

    class Meta:
        verbose_name = 'платёж'
        verbose_name_plural = 'Список'

    def __str__(self):
        return str(self.id)
