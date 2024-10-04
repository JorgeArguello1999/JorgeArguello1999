from django.db import models
from django.utils import timezone

# Types of Data
CONTENT_TYPE = [
    ('DIP', 'Diploma'),
    ('EXP', 'Experience'),
    ('ART', 'Article'),
    ('OTH', 'Other')
] 
class Experiences(models.Model):
    experiences_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=800)
    description = models.TextField(blank=True, null=True)
    organization = models.CharField(max_length=300)

    date_from = models.DateField()
    date_to = models.DateField(null=True, blank=True)

    experience_type = models.CharField(
        max_length=3, 
        choices=CONTENT_TYPE,
        default='DIP'
    )

    diploam_url = models.URLField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    project_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"{self.experiences_id} [{self.experience_type}] {self.title}"