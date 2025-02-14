from django.shortcuts import render

# Models
from projects import models

# Create your views here.
def projects(request):
    projects_list = models.Project.objects.all()
    return render(request, 'projects.html', {'projects': projects_list})