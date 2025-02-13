from django.shortcuts import render

# Models
from home import models

# Create your views here.
def home(request):
    user = models.Profile.objects.first()
    return render(request, 'home.html', {'user': user})