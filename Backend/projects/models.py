from django.db import models
from Auth.models import User

class Role(models.Model):
    roleName = models.CharField(max_length=32, default="Admin")
    project = models.ForeignKey("project", on_delete=models.CASCADE, related_name="projectroles")
    users = models.ManyToManyField(User, blank=True, related_name="userRoles")
    isAdmin = models.BooleanField(default=False, blank=False)
    canCreate = models.BooleanField(default=True, blank=False)
    canDelete = models.BooleanField(default=True, blank=False)
    canModifyFiles = models.BooleanField(default=True, blank=False)
    
class Folder(models.Model):
    FolederName = models.CharField(max_length=32)
    parentFolder = models.ForeignKey('self', on_delete=models.CASCADE, related_name="childrenfolders", null=True, blank=True)
    limitedVisibility = models.BooleanField(default=False, blank=False)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfolders")

class File(models.Model):
    FileName = models.CharField(max_length=128)
    parentFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="childrenfiles", null=True)
    data = models.FileField(null=True, default=None, blank=True)
    limitedVisibility = models.BooleanField(default=False, blank=False)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfiles")
    filetype = models.CharField(max_length=32, default=None, null=True)
    version = models.IntegerField(default=0)


class Project(models.Model):
    projectName = models.CharField(max_length=32)
    id = models.BigAutoField(primary_key=True)
    rootFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True)
    user = models.ManyToManyField(User, related_name='projectsin')
    creatorole = models.ForeignKey(Role, related_name="creatorole", on_delete=models.SET_NULL, default=None, null=True, blank=True)
    defaultrole = models.ForeignKey(Role, related_name="defaultrole", on_delete=models.SET_NULL, default=None, null=True, blank=True)

class InviteToken(models.Model):
    number = models.BigIntegerField()
    From = models.ForeignKey(User, related_name="invitetokenfrom", on_delete=models.CASCADE, default=None, null=True)
    project = models.ForeignKey(Project, related_name="projectinvites", on_delete=models.CASCADE, default=None, null=True)


