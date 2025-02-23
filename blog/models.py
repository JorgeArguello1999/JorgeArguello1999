from django.db import models

# Another model
from projects.models import Skill

# Entry model
class Entry(models.Model):
    # Basic Information
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True) 
    date = models.DateField(auto_now=True)
    content = models.TextField()
    image = models.URLField()

    # Skill???
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return self.title