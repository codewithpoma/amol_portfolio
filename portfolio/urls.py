from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="home"),
    path('contact/submit/', views.submit_contact, name="submit_contact"),
]
