from django.db import models

class Skill(models.Model):
    title = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    usage = models.TextField(blank=True, null=True)  
    image = models.URLField()
    youtube = models.URLField(blank=True, null=True) 
    skills = models.ManyToManyField(Skill, blank=True)  

    def __str__(self):
        return self.title
