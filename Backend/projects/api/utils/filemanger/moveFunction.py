from .GetFunctions import get_file, get_folder
from ..filemanger.namesControler import name_conflict_file, name_conflict_folder
from ..common.RolePropgation import RolePropgate

def getRoles(newParent):
    if newParent.parentFolder == None:
        return newParent.parentRoles.all()
    if newParent.parentFolder.limitedVisibility:
        roles = newParent.allowedRoles.all()
    else:
        roles = newParent.parentRoles.all()
    return roles

def cutHandler(ft, fp, roles, user, nameConflictFunc, isFile=True) -> str:
    ft.parentFolder = fp
    if isFile:
        allowedRoles = ft.allowedRoles.filter(roleName__in=roles.values_list('roleName', flat=True))
        ft.allowedRoles.set(allowedRoles)
        ft.parentRoles.set(roles)
    ft.save()

    name = nameConflictFunc(ft)

    if ft.limitedVisibility and ft.allowedRoles.count() < 1:
        ft.allowedRoles.add(ft.parentRoles.filter(users=user).first())

    return name


def cut_file(TargetUUID, ParentUUID, project, user):
    ok, newParent = get_folder(ParentUUID, project, user)
    ok2, file = get_file(TargetUUID, project, user)
    if (not ok) or (not ok2):
        return False, (file if not ok2 else newParent), None, None
    
    roles = getRoles(newParent)
    
    return True, cutHandler(file, newParent, roles, user, name_conflict_file), newParent.UUID, file.UUID

def cut_folder(TargetUUID, ParentUUID, project, user):
    ok, newParent = get_folder(ParentUUID, project, user)
    ok2, folder = get_folder(TargetUUID, project, user)
    if (not ok) or (not ok2):
        return False, (folder if not ok2 else newParent), None, None
    
    roles = getRoles(newParent)

    rolesIn = getRoles(folder)

    addedRoles = roles.exclude(roleName__in = rolesIn.values_list('roleName', flat=True))
    removedRoles = rolesIn.exclude(roleName__in = roles.values_list('roleName', flat=True))

    name = cutHandler(folder, newParent, roles, user, name_conflict_folder, False)

    RolePropgate(folder, addedRoles, removedRoles, not folder.limitedVisibility)

    return True, name, newParent.UUID, folder.UUID




    