from django.urls import path
from . import views

app_name = 'info'

urlpatterns = [
    path('online/', views.get_online, name='online'),
    path('coupon/', views.check_coupon, name="coupon"),
    path('player/', views.check_player, name="player"),
]