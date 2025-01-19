from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userprofile")
    pfp = models.ImageField(upload_to="images/users/pfp")
    displayName = models.CharField(max_length=32)
    connections = models.ManyToManyField("self", blank=True)
    outgoingrequest = models.ManyToManyField("self", blank=True)
    incomingrequests = models.ManyToManyField("self", blank=True)

