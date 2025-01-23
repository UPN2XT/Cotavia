from ... import models

def allowed(f, user) -> bool:
    if f.limitedVisibility:
        return f.allowedRoles.filter(users=user).exists()
    return True

def copyFolder(request, RefrenceFolder: models.Folder):
    copyRoot = models.Folder.objects.create(FolederName=RefrenceFolder.FolederName, 
            limitedVisibility=RefrenceFolder.limitedVisibility)
    copyRoot.allowedRoles.set(RefrenceFolder.allowedRoles.all())
    for folder in RefrenceFolder.childrenfolders.all():
        if not allowed(folder, request.user):
            continue
        f: models.Folder = copyFolder(request, folder)
        f.parentFolder = copyRoot
        f.save()
        
    for file in RefrenceFolder.childrenfiles.all():
        if not allowed(file, request.user):
            continue
        f = models.File.objects.create(FileName=file.FileName, parentFolder=copyRoot,
            data=file.data, limitedVisibility=file.limitedVisibility)
        f.allowedRoles.set(file.allowedRoles.all())
    return  copyRoot 

def deleteFile(request, path, parentFolder):
    file: models.File = getFile(path, parentFolder, request.user)
    if file == None:
        return False
    file.delete()
    return True

def deleteFolder(request, path, parentFolder):
    folder: models.Folder = getFolder(path, parentFolder, request.user)
    if folder == None:
        return False
    folder.delete()
    return True

def createCopyName(name, i):
    x = name.split(".")
    x[0] += f"({i})"
    return ".".join(x)

def createFolder(path: str, ParentFolder: models.Folder, name: str, user: models.User) -> models.Folder:
    target = getFolder(path, ParentFolder, user)
    if target == None:
        return None
    neo = name
    i = 1
    while target.childrenfolders.filter(FolederName=neo):
        neo = createCopyName(name, i)
        i+=1
    model = models.Folder.objects.create(FolederName=neo, parentFolder=target)
    return model

def createFile(path: str, ParentFolder: models.Folder, name: str, data: str, user: models.User) -> models.File:
    target = getFolder(path, ParentFolder, user)
    neo = name
    i = 1
    while target.childrenfiles.filter(FileName=neo):
        neo = createCopyName(name, i)
        i+=1
        
    model = models.File.objects.create(data= data, parentFolder=target, FileName= neo)
    return model

def getFolder(path: str, ParentFolder: models.Folder, user: models.User) -> models.Folder:
    if not path:
        return ParentFolder
    currentFolder: models.Folder = ParentFolder
    nodes = path.split('/')
    for node in nodes:
        try:
            currentFolder = currentFolder.childrenfolders.get(FolederName=node)
        except:
            return None
        if not allowed(currentFolder, user):
            return None
    return currentFolder

def getFile(path: str, ParentFolder: models.Folder, user: models.User) -> models.File:
    if not path:
        return None
    
    *nodes, file = path.split('/')
    target = getFolder('/'.join(nodes), ParentFolder, user)
    if target == None:
        return None
    try:
        f: models.File = target.childrenfiles.get(FileName=file)
    except:
        return None
    
    if not allowed(f, user):
        return None
    return f

def createPathTree(ParentFolder: models.Folder, user: models.User) -> dict:
    me: dict = {'name': ParentFolder.FolederName}
    if (ParentFolder.childrenfolders.exists()):
        me['folders'] = {}
        for folder in ParentFolder.childrenfolders.all():
            if not allowed(folder, user):
                continue
            me['folders'][folder.FolederName] = createPathTree(folder, user)
    else:
        me['folders'] = None
    
    if (ParentFolder.childrenfiles.exists()):
        me['files'] = {}
        for file in ParentFolder.childrenfiles.all():
            if not allowed(file, user):
                continue
            me['files'][file.FileName] = file.data
    else:
        me['files'] = None

    return me