from django.db import models
from Auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.core.files.base import ContentFile
import uuid
import os
from .api.utils.filemanger.namesControler import name_conflict_file, name_conflict_folder

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
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='projectfolders', default=None, null=True)
    FolederName = models.CharField(max_length=128, default="")
    name = models.CharField(max_length=128, default="")
    parentFolder = models.ForeignKey('self', on_delete=models.CASCADE, related_name="childrenfolders", null=True, blank=True)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfolders")
    parentRoles = models.ManyToManyField(Role, related_name="rolesofparentfolders")
    limitedVisibility = models.BooleanField(default=False, blank=False)
    UUID = models.UUIDField(default=uuid.uuid4, editable=False, db_index=True, unique=True)

    def copy(self, new_parent_folder, user: User):
        new_instance = Folder.objects.create(
            project = self.project,
            name = self.name,
            parentFolder = new_parent_folder,
            limitedVisibility = self.limitedVisibility
        )

        roleInheritanceCopy(self, new_instance, user)

        name_conflict_folder(new_instance)

        return new_instance

class File(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, default=None, related_name="projectfiles")
    FileName = models.CharField(max_length=128)
    name = models.CharField(max_length=128, default=FileName)
    parentFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="childrenfiles", null=True)
    allowedRoles = models.ManyToManyField(Role, related_name="roleconnnectedfiles")
    parentRoles = models.ManyToManyField(Role, related_name="rolesofparentfiles")
    limitedVisibility = models.BooleanField(default=False, blank=False)
    UUID = models.UUIDField(default=uuid.uuid4, editable=False, db_index=True)
    filetype = models.CharField(max_length=32, default=None, null=True)
    version = models.IntegerField(default=0)
    data = models.FileField(null=True, default=None, blank=True, upload_to=get_file_upload_path)
    
    def copy(self, new_parent_folder: Folder, user: User):
    
        new_instance = File.objects.create(
            project=self.project,
            name=self.name,
            parentFolder=new_parent_folder,  # Set the new folder
            filetype=self.filetype,
            version=self.version,
            limitedVisibility=self.limitedVisibility,
        )

        if self.data:
            self.data.open('rb')
            file_content = self.data.read()
            self.data.close()
            new_instance.data.save(self.data.name, ContentFile(file_content), save=True)

        roleInheritanceCopy(self, new_instance, user)
        name_conflict_file(new_instance)

        return new_instance


class Project(models.Model):
    projectName = models.CharField(max_length=32)
    id = models.BigAutoField(primary_key=True)
    rootFolder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, related_name="projectroot")
    user = models.ManyToManyField(User, related_name='projectsin')
    creatorole = models.ForeignKey(Role, related_name="creatorole", on_delete=models.SET_NULL, default=None, null=True, blank=True)
    defaultrole = models.ForeignKey(Role, related_name="defaultrole", on_delete=models.SET_NULL, default=None, null=True, blank=True)

class InviteToken(models.Model):
    number = models.BigIntegerField()
    From = models.ForeignKey(User, related_name="invitetokenfrom", on_delete=models.CASCADE, default=None, null=True)
    project = models.ForeignKey(Project, related_name="projectinvites", on_delete=models.CASCADE, default=None, null=True)


def roleInheritanceCopy(self, new_instance: Folder | File, user: User):
    new_parent_folder = new_instance.parentFolder
    if new_instance.parentFolder.limitedVisibility:
        roles = new_parent_folder.allowedRoles.all()
    else:
        roles = new_parent_folder.parentRoles.all()
    new_instance.parentRoles.set(roles)
    new_instance.allowedRoles.set(self.allowedRoles.filter(roleName__in=roles.values_list('roleName', flat=True)))
    if new_instance.limitedVisibility and new_instance.allowedRoles.count()< 1:
        new_instance.allowedRoles.add(roles.get(users=user))

@receiver(post_delete, sender=File)
def delete_file_on_model_delete(sender, instance, **kwargs):
    if instance.data:
        instance.data.delete(save=False)


@receiver(post_save, sender=[Folder, File])
def RoleInheritance(sender, instance: Folder | File, created, **kwargs):
    if created and instance.parentFolder != None:
        if instance.parentFolder.limitedVisibility:
            instance.parentRoles.set(instance.parentFolder.allowedRoles.all())
            return 
        instance.parentRoles.set(instance.parentFolder.parentRoles.all())




