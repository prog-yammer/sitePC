# Generated by Django 4.0.1 on 2022-01-30 22:56

import apps.info.models
import django.core.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Coupons',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(db_index=True, max_length=50, unique=True, verbose_name='Код')),
                ('nickname', models.CharField(default='-', max_length=50, verbose_name='Ник владельца')),
                ('discount', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Скидка')),
                ('count', models.CharField(default='-', max_length=20, verbose_name='Количество')),
                ('valid_from', models.DateTimeField(db_index=True, default=django.utils.timezone.now, verbose_name='Действителен с')),
                ('valid_to', models.DateTimeField(default=apps.info.models.get_date_valid_to, verbose_name='Действителен по')),
                ('active', models.BooleanField(db_index=True, default=True, verbose_name='Купон активен')),
            ],
            options={
                'verbose_name': 'купон',
                'verbose_name_plural': 'Купоны',
            },
        ),
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=apps.info.models.get_last_number_image, verbose_name='Номер')),
                ('image', models.ImageField(upload_to='images', verbose_name='Изображение')),
            ],
            options={
                'verbose_name': 'картинка',
                'verbose_name_plural': 'Картинки',
                'ordering': ['number'],
            },
        ),
        migrations.CreateModel(
            name='MenuLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=apps.info.models.get_last_number_links, verbose_name='Номер')),
                ('name', models.CharField(max_length=50, verbose_name='Название ссылки')),
                ('link', models.CharField(max_length=50, verbose_name='Ссылка')),
            ],
            options={
                'verbose_name': 'ссылку',
                'verbose_name_plural': 'Ссылки бокового меню',
                'ordering': ['number'],
            },
        ),
        migrations.CreateModel(
            name='Players',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(db_index=True, max_length=200)),
                ('vk', models.CharField(db_index=True, default='-', max_length=200)),
                ('vk_name', models.CharField(db_index=True, default='-', max_length=200)),
                ('add_date', models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={
                'verbose_name': 'игрока',
                'verbose_name_plural': 'Игроки',
            },
        ),
        migrations.CreateModel(
            name='SiteMessages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sm_name', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50, verbose_name='Раздел')),
                ('text', models.CharField(default='', max_length=500, verbose_name='Содержание')),
            ],
            options={
                'verbose_name': 'раздел',
                'verbose_name_plural': 'Сообщения на сайте',
                'ordering': ['id'],
            },
        ),
    ]
