from django.shortcuts import render
from django.shortcuts import get_object_or_404
from blog.models import blog_entry

# GET Method
def blog(request):
    blogs_title_entry = blog_entry.objects.values('title', 'created_at', 'blog_id', 'image_url')
    return render(request=request, template_name='blog.html', context={
        "blogs_entry_titles": blogs_title_entry
    })

# GET Blog Detail
def blog_detail(request, blog_id):
    data = get_object_or_404(blog_entry, blog_id=blog_id)
    return render(request=request, template_name='blog_detail.html', context={
        "data": data
    })