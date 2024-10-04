from django.shortcuts import render

# GET Contact view
def contact(request):
    return render(request=request, template_name='contact.html')