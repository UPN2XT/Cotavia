from ....models import Folder, File, Project, User
from ..common.allowedAcess import allowed
from .GetFunctions import get_folder
from .namesControler import name_conflict_file, name_conflict_folder
from ..common.FileCore import createFile

def create_file(parentUUID: str, project: Project, data, name: str, user: User, filetype: str):
    ok, parent = get_folder(parentUUID, project, user)
    if not ok:
        return False, parent
    target = File.objects.create(parentFolder=parent, name=name, filetype=filetype, project=project, data=data)
    target.save()
    name_conflict_file(target)
    return True, target

def create_folder(parentUUID: str, project: Project, name: str, user: User):
    ok, parent = get_folder(parentUUID, project, user)
    if not ok:
        return False, parent
    target = Folder.objects.create(parentFolder=parent, name=name, project=project)
    name_conflict_folder(target)
    return True, target