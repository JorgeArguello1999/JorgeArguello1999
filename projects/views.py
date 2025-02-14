from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.shortcuts import get_list_or_404

# Models
from projects import models

# Create your views here.
def projects(request):
    projects_list = get_list_or_404(models.Project)
    return render(request, 'projects.html', {'projects': projects_list})

def project_detail(request, name):
    project = get_object_or_404(models.Project, title=name)
    return render(request, 'project_detail.html', {'project': project})