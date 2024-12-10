from django.urls import path
from . import views

urlpatterns = [
    path('<str:pk>/', views.Main.as_view(), name='main'),
]