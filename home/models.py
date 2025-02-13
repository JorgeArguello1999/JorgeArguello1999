from django.db import models

# Profile model
class Profile(models.Model):
    # Basic Information
    user = models.CharField(max_length=255, unique=True) 
    description = models.TextField()
    image = models.URLField()

    # Social Media
    github = models.URLField()
    instagram = models.URLField()
    linkedin = models.URLField()
    youtube = models.URLField()    

    def __str__(self):
        return self.user