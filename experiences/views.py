from django.shortcuts import render

# Experiences (home)
def experiences(request):
    data = 22
    return render(request=request, template_name='experiences.html', context={
        "data": data
    })