from ... import models

def allowed(f, user) -> bool:
    if f.limitedVisibility:
        return f.allowedRoles.filter(users=user).exits()
        # old implementaion
        '''allowed = False
        allowedRoles = f.allowedRoles.all()
        for role in allowedRoles:
            if user in role.users.all():
                allowed = True
                break
        if not allowed:
            return False'''
    return True


def createFolder(path: str, ParentFolder: models.Folder, name: str, user: models.User) -> models.Folder:
    target = getFolder(path, ParentFolder, user)
    if target == None:
        return None
    model = models.Folder.objects.create(FolederName=name, parentFolder=target)
    return model

def createFile(path: str, ParentFolder: models.Folder, name: str, data: str, user: models.User) -> models.File:
    target = getFolder(path, ParentFolder, user)
    model = models.File.objects.create(data= data, parentFolder=target, FileName= name)
    return model

def getFolder(path: str, ParentFolder: models.Folder, user: models.User) -> models.Folder:
    if not path:
        return ParentFolder
    currentFolder: models.Folder = ParentFolder
    nodes = path.split('/')
    for node in nodes:
        currentFolder = currentFolder.childrenfolders.get(FolederName=node)
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
    f: models.File = target.childrenfiles.get(FileName=file)
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