from django.shortcuts import render

from experiences.models import Experiences

# Experiences (home)
def experiences(request):
    data = Experiences.objects.all()
    return render(request=request, template_name='experiences.html', context={
        "data": data
    })