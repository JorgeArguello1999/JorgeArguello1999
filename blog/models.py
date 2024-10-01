from django.db import models
from django.utils import timezone

# Table for Blogs Entries
class blog_entry(models.Model):
    title = models.CharField(max_length=300)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    # External URL
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)

    def __str__(self) -> str:
        return self.title