from django.db import models
from django.contrib.auth.models import User

# Create your models here.

def getPath(profile, filename):
    return f"images/users/pfp/{profile.user.username}.pfp"

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userprofile")
    pfp = models.ImageField(upload_to=getPath)
    displayName = models.CharField(max_length=32)
    connections = models.ManyToManyField("self", blank=True)
class ConnectionRequest(models.Model):
    From = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="outgoingrequest")
    To = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="incomingrequests")

