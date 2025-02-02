from django.db import models
from Auth.models import User
from django.db.models.signals import post_delete
from django.core.files.base import ContentFile
from django.dispatch import receiver
import uuid
import os


def get_file_upload_path(instance, filename):
    """Generates upload path: 'projects/project_<project_id>/<uuid>.<ext>'"""
    ext = os.path.splitext(filename)[1]  # Get file extension with dot
    return f"projects/project_{instance.project.id}/{instance.parentFolder.UUID}/{instance.UUID}.{ext}"

class Role(models.Model):
    roleName = models.CharField(max_length=32, default="Admin")
    project = models.ForeignKey("project", on_delete=models.CASCADE, related_name="projectroles")
    users = models.ManyToManyField(User, blank=True, related_name="userRoles")
    isAdmin = models.BooleanField(default=False, blank=False)
    canCreate = models.BooleanField(default=True, blank=False)
    canDelete = models.BooleanField(default=True, blank=False)
    canModifyFiles = models.BooleanField(default=True, blank=False)
    
class Folder(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    FolederName = models.CharField(max_length=128)
    parentFolder = models.ForeignKey('self', on_delete=models.CASCADE, related_name="childrenfolders", null=True, blank=True)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfolders")
    parentRoles = models.ManyToManyField(Role, related_name="rolesofparentfolders")
    limitedVisibility = models.BooleanField(default=False, blank=False)
    UUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)

class File(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    FileName = models.CharField(max_length=128)
    parentFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="childrenfiles", null=True)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfiles")
    parentRoles = models.ManyToManyField(Role, related_name="rolesofparentfiles")
    limitedVisibility = models.BooleanField(default=False, blank=False)
    UUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    filetype = models.CharField(max_length=32, default=None, null=True)
    version = models.IntegerField(default=0)
    data = models.FileField(null=True, default=None, blank=True, upload_to=get_file_upload_path)
    def copy(self, new_parent_folder):
    
        new_instance = File.objects.create(
            project=self.project,
            FileName=self.FileName,
            parentFolder=new_parent_folder,  # Set the new folder
            filetype=self.filetype,
            version=self.version,
            limitedVisibility=False,
        )

        if self.data:
            self.data.open('rb')
            file_content = self.data.read()
            self.data.close()
            new_instance.data.save(self.data.name, ContentFile(file_content), save=True)

        new_instance.parentRoles.set(new_parent_folder.allowedRoles.all())

        return new_instance


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


@receiver(post_delete, sender=File)
def delete_file_on_model_delete(sender, instance, **kwargs):
    if instance.data:
        instance.data.delete(save=False)


