from django.db import models


class Category(models.Model):
    name = models.CharField("Название", max_length=50)
    icon = models.CharField("Иконка", max_length=50, default="category") # TODO
    server_name = models.CharField("Имя сервера", max_length=50)

    class Meta:
        verbose_name = 'категорию'
        verbose_name_plural = 'Категории'
        ordering = ("id",)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    category = models.ForeignKey(Category, verbose_name='Категория', related_name='subcategory',
                                 on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=50)

    CHECK_METHOD = {
        ("-", "Не нужна проверка"),
        ("have", "Проверить наличие предмета"),
        ("have_more", "Проверить ценность пермишена"),
    }

    check_to_buy = models.CharField("Проверка возможности", max_length=50, default=None, choices=CHECK_METHOD)
    command = models.CharField("Команда выдачи", max_length=50,
                               help_text="%player% - ник покупателя. %product% - имя товара для команды")
    icon = models.CharField("Иконка", max_length=50, default="category")

    class Meta:
        verbose_name = 'подкатегорию'
        verbose_name_plural = 'Подкатегории'
        ordering = ("category", "id")

    def __str__(self):
        return self.name


class Product(models.Model):
    subcategory = models.ForeignKey(Subcategory, verbose_name='Подкатегория', related_name='products',
                                    on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=50)
    name_for_command = models.CharField("Имя для команды", max_length=50)
    image = models.ImageField("Изображение", upload_to='products', blank=True)
    description = models.TextField("Описание")
    price = models.IntegerField("Цена", default=0)
    created = models.DateTimeField("Создано", auto_now_add=True)
    edited = models.DateTimeField("Изменено", auto_now=True)

    def category(self) -> Category:
        return self.subcategory.category

    category.short_description = 'Категория'
    category.admin_order_field = 'subcategory'

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'Товары'
        ordering = ("subcategory", "id")

    def __str__(self):
        return self.name