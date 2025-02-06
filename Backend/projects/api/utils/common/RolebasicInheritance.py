def BasicInheritance(f):
    if f.parentFolder.limitedVisibility:
        f.parentRoles.set(f.parentFolder.allowedRoles.all())
        return 
    f.parentRoles.set(f.parentFolder.parentRoles.all())