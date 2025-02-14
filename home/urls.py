from django.urls import path
from home import views

urlpatterns = [
    path('', views.home, name='home'),
]

# Error Handler
handler404 = 'home.views.custom_404'
handler500 = 'home.views.custom_500'