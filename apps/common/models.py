from django.db import models

class BackgroundImage(models.Model):

    image = models.ImageField("Изображение", upload_to='images')

    class Meta:
        verbose_name = 'изображение'
        verbose_name_plural = 'Изображения'
        ordering = ("id", )

    def __str__(self):
        return f"Изображение {self.image.path}"


class MenuLinks(models.Model):
    name = models.CharField("Название ссылки", max_length=50)
    link = models.CharField("Ссылка", max_length=50)

    class Meta:
        verbose_name = 'ссылку'
        verbose_name_plural = 'Ссылки бокового меню'
        ordering = ["id", ]

    def __str__(self):
        return f'Ссылка "{self.name}"'
