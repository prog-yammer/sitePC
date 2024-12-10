from django.urls import path
from . import views

urlpatterns = [
    path("", views.Main.as_view(), name="index"),
    path('shop/api/<str:pk>', views.Api.as_view(), name='api'),
]