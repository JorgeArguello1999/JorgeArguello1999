from django.shortcuts import render

# Models
from home import models

# Create your views here.
def home(request):
    user = models.Profile.objects.first()
    return render(request, 'home.html', {'user': user})

# Error 404
def custon_404(request):
    return render(request, '404.html', status=404)

# Error 500
def custon_500(request):
    return render(request, '500.html', status=500)