from django.db import models


def get_last_number_category():
    return len(Category.objects.all()) + 1


class Category(models.Model):
    name = models.CharField("Название", max_length=50)
    icon = models.CharField("Иконка", max_length=50, default="category")
    server_name = models.CharField("Имя сервера", max_length=50, default="-")
    number = models.IntegerField("Номер", default=get_last_number_category)

    class Meta:
        verbose_name = 'категорию'
        verbose_name_plural = 'Категории'
        ordering = ("number",)

    def __str__(self):
        return self.name


def get_last_number_subcategory():
    try:
        return Subcategory.objects.order_by("-category", "-number")[0].number + 1
    except:
        return "1"


class Subcategory(models.Model):
    category = models.ForeignKey(Category, verbose_name='Категория', related_name='subcategory',
                                 on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=50)

    CHECK_METHOD = {
        ("-", "Не нужна проверка"),
        ("have", "Проверить наличие предмета"),
        ("have_more", "Проверить ценность пермишена"),
    }

    check_to_buy = models.CharField("Проверка возможности", max_length=50, default="-", choices=CHECK_METHOD)
    command = models.CharField("Команда выдачи", max_length=50,
                               help_text="%player% - ник покупателя. %product% - имя товара для команды")
    icon = models.CharField("Иконка", max_length=50, default="category")
    number = models.IntegerField("Номер", default=get_last_number_subcategory)

    class Meta:
        verbose_name = 'подкатегорию'
        verbose_name_plural = 'Подкатегории'
        ordering = ("category", "number")

    def __str__(self):
        return self.name


class Product(models.Model):
    subcategory = models.ForeignKey(Subcategory, verbose_name='Подкатегория', related_name='products',
                                    on_delete=models.CASCADE)
    name = models.CharField("Название", max_length=50)
    name_for_command = models.CharField("Имя для команды", max_length=50, db_index=True, default="-")
    image = models.ImageField("Изображение", upload_to='products', blank=True)
    description = models.TextField("Описание")
    price = models.IntegerField("Цена", db_index=True)
    created = models.DateTimeField("Создано", auto_now_add=True)
    edited = models.DateTimeField("Изменено", auto_now=True)

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'Товары'
        ordering = ("subcategory", "price")

    def __str__(self):
        return self.name
