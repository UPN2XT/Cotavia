from ....models import Role, File, Folder
from django.db.models import Subquery


def setRoleInheritance(f: Folder | File, roles: Role, ADD, allowAddPropagation):
    if ADD: # action add a role
        if not allowAddPropagation:
            return
        f.parentRoles.add(*roles)
        return
    f.allowedRoles.remove(*roles) # action b remove a role
    f.parentRoles.remove(*roles) 
    if f.limitedVisibility and f.allowedRoles.count() < 1:
        f.allowedRoles.add(f.parentRoles.filter(isAdmin=True).first())


# do the two actions of adding and removing roles
def changeRoles(f, addedRoles, removedRoles, allowAddPropagation):
    setRoleInheritance(f, addedRoles, True, allowAddPropagation)
    setRoleInheritance(f , removedRoles, False, allowAddPropagation)
    

def RolePropgate(parent: Folder, addedRoles, removedRoles, allowAddPropagation=True, Root=False):
    if not Root:
        changeRoles(parent, addedRoles, removedRoles, allowAddPropagation)
    if parent.limitedVisibility:
        allowAddPropagation = False
    folders = parent.childrenfolders.all()
    files = parent.childrenfiles.all()
    folder:Folder = None # this exists for auto complete purposes
    for folder in folders:
        RolePropgate(folder, addedRoles, removedRoles, allowAddPropagation)
    file: File = None # this exists for auto complete purposes
    for file in files:
        changeRoles(file, addedRoles, removedRoles, allowAddPropagation)
        