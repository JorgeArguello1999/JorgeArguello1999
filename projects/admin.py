from django.contrib import admin

# Models
from projects import models

# Register your models here.
admin.site.register(models.Skill)
admin.site.register(models.Project)