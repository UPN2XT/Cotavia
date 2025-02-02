from ....models import Role, File, Folder
from django.db.models import Subquery


def setRoleInheritance(f: Folder | File, roles: Role, ADD):
    if ADD: # action add a role
        f.parentRoles.add(*roles)
        return
    f.allowedRoles.remove(*roles) # action b remove a role
    f.parentRoles.remove(*roles) 


# do the two actions of adding and removing roles
def changeRoles(f, addedRoles, removedRoles):
    setRoleInheritance(f, addedRoles, True)
    setRoleInheritance(f , removedRoles, False)
    

def RolePropgate(parent: Folder, addedRoles, removedRoles):
    changeRoles(folder, addedRoles, removedRoles)
    folders = parent.childrenfolders.all()
    files = parent.childrenfiles.all()
    folder:Folder = None # this exists for auto complete purposes
    for folder in folders:
        RolePropgate(folder)
    file: File = None # this exists for auto complete purposes
    for file in files:
        changeRoles(file, addedRoles, removedRoles)
        