from django.shortcuts import render
from blog.models import blog_entry

# GET Method
def blog(request):
    blogs_title_entry = blog_entry.objects.values('title', 'created_at')
    return render(request=request, template_name='blog.html', context={
        "blogs_entry_titles": blogs_title_entry
    })