# Generated by Django 5.1.1 on 2024-10-01 01:56

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="blog_entry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=300)),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("instagram_url", models.URLField(blank=True, null=True)),
                ("youtube_url", models.URLField(blank=True, null=True)),
                ("twitter_url", models.URLField(blank=True, null=True)),
                ("github_url", models.URLField(blank=True, null=True)),
                ("external_url", models.URLField(blank=True, null=True)),
            ],
        ),
    ]