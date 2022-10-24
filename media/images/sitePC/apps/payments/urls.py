from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('create/', views.create_payment),
    path('qiwi_handler/', views.qiwi_handler),
    path('paymaster_handler/', views.paymaster_handler),
]
