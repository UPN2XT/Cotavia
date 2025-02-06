from ....models import Folder, File, Project, User
from ..common.allowedAcess import allowed

def get_check(target: File | Folder, project: Project, user: User):
    if target == None:
        return False, 'NF' # Not Found
    if target.project != project:
        return False, "OA" # Outside Acess
    if not allowed(target, user):
        return False, "RAD" # Role Acess Denied
    return True, target

def get_file(uuid: str, project: Project, user: User):
    try:
        target: File = File.objects.get(UUID=uuid)
    except:
        target = None
    return get_check(target, project, user)

def get_folder(uuid: str, project: Project, user: User):
    target: Folder = Folder.objects.get(UUID=uuid)
    return get_check(target, project, user)
