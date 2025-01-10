from django.db import models
from Auth.models import User

class Folder(models.Model):
    FolederName = models.CharField(max_length=32)
    parentFolder = models.ForeignKey('self', on_delete=models.CASCADE, related_name="childrenfolders", null=True, blank=True)

class File(models.Model):
    FileName = models.CharField(max_length=32)
    parentFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="childrenfiles", null=True)
    data = models.TextField()


class Project(models.Model):
    projectName = models.CharField(max_length=32)
    id = models.BigAutoField(primary_key=True)
    rootFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True)
    user = models.ManyToManyField(User, related_name='projectsin')



