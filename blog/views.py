from django.shortcuts import render

from blog.models import Entry

# Create your views here.
def blog(request):
    entries = Entry.objects.all()
    return render(request, 'blog.html', context={
        'entries': entries
    })