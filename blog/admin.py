from django.contrib import admin

from blog import models

# Register your models here.
@admin.register(models.Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'image')