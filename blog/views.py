from django.shortcuts import render
from django.shortcuts import get_object_or_404

from blog.models import Entry

# Create your views here.
def blog(request):
    entries = Entry.objects.all()
    return render(request, 'blog.html', context={
        'entries': entries
    })

def post(request, pk):
    entry = get_object_or_404(Entry, pk=pk)
    return render(request, 'post.html', context={
        'entry': entry
    })