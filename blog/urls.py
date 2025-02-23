from django.urls import path
from blog import views

urlpatterns = [
    path('', views.blog, name='blog'),
    path('<int:pk>/', views.post, name='post'),
]