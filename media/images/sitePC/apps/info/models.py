from datetime import timedelta

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Players(models.Model):
    nickname = models.CharField(max_length=200, db_index=True)
    vk = models.CharField(max_length=200, default="-", db_index=True)
    vk_name = models.CharField(max_length=200, default="-", db_index=True)
    add_date = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'игрока'
        verbose_name_plural = 'Игроки'

    def __str__(self):
        return self.nickname


def get_date_valid_to():
    return timezone.now() + timedelta(days=3650)


class Coupons(models.Model):
    code = models.CharField("Код", max_length=50, db_index=True, unique=True)
    nickname = models.CharField("Ник владельца", max_length=50, default="-")
    discount = models.IntegerField("Скидка", validators=[MinValueValidator(0), MaxValueValidator(100)])
    count = models.CharField("Количество", max_length=20, default="-")
    valid_from = models.DateTimeField("Действителен с", default=timezone.now, db_index=True)
    valid_to = models.DateTimeField("Действителен по", default=get_date_valid_to)
    active = models.BooleanField("Купон активен", default=True, db_index=True)

    class Meta:
        verbose_name = 'купон'
        verbose_name_plural = 'Купоны'

    def __str__(self):
        return f"{self.code}_{self.discount}"


def get_last_number_image():
    return len(Images.objects.all()) + 1


class Images(models.Model):
    number = models.IntegerField("Номер", default=get_last_number_image)
    image = models.ImageField("Изображение", upload_to='images')

    class Meta:
        verbose_name = 'картинка'
        verbose_name_plural = 'Картинки'
        ordering = ["number", ]

    def __str__(self):
        return f"Картинка {self.number}"


def get_last_number_links():
    return len(MenuLinks.objects.all()) + 1


class MenuLinks(models.Model):
    number = models.IntegerField("Номер", default=get_last_number_links)
    name = models.CharField("Название ссылки", max_length=50)
    link = models.CharField("Ссылка", max_length=50)

    class Meta:
        verbose_name = 'ссылку'
        verbose_name_plural = 'Ссылки бокового меню'
        ordering = ["number", ]

    def __str__(self):
        return f'Ссылка "{self.name}"'


class SiteMessages(models.Model):
    sm_name = models.CharField(max_length=50)
    name = models.CharField("Раздел", max_length=50)
    text = models.CharField("Содержание", max_length=500, default="")

    class Meta:
        verbose_name = 'раздел'
        verbose_name_plural = 'Сообщения на сайте'
        ordering = ["id", ]

    def __str__(self):
        return str(self.name)
