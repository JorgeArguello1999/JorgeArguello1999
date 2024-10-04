from django.urls import path
from experiences import views

urlpatterns = [
    path('', views.experiences, name='experiences'),
]