from django.shortcuts import render

# GET Method
def blog(request):
    return render(request=request, template_name='blog.html')