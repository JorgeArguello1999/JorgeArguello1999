from home import models

def global_context(request):
    profile = models.Profile.objects.first()
    return {'profile': profile}