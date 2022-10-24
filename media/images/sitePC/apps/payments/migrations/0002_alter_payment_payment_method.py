# Generated by Django 4.0.2 on 2022-02-08 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='payment_method',
            field=models.CharField(choices=[('cards', 'Карты'), ('qiwi', 'Qiwi'), ('mobile', 'Мобильный счет')], default='cards', max_length=20, verbose_name='Способ оплаты'),
        ),
    ]