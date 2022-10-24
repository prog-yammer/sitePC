from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('', views.main, name='main'),
    path('<str:pk>/', views.other, name='other'),
    # path(r'^products/$', views.get_products),
]