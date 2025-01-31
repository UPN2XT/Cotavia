from ... import models
from . import FileCore

def allowed(f, user) -> bool:
    if f.limitedVisibility:
        return f.allowedRoles.filter(users=user).exists()
    return True

def copyFolder(request, RefrenceFolder: models.Folder, id, path="", basePath=True):
    copyRoot = models.Folder.objects.create(FolederName=RefrenceFolder.FolederName, 
            limitedVisibility=RefrenceFolder.limitedVisibility)
    copyRoot.allowedRoles.set(RefrenceFolder.allowedRoles.all())
    if not basePath:
        path= path+"/"+copyRoot.FolederName if path != "" else copyRoot.FolederName
    for folder in RefrenceFolder.childrenfolders.all():
        if not allowed(folder, request.user):
            continue
        f: models.Folder = copyFolder(request, folder, path, False)
        f.parentFolder = copyRoot
        f.save()
        
    for file in RefrenceFolder.childrenfiles.all():
        if not allowed(file, request.user):
            continue
        f = models.File.objects.create(FileName=file.FileName, parentFolder=copyRoot,
            data=file.data, limitedVisibility=file.limitedVisibility)
        with FileCore.openFile(f.data.path) as source:
            s = FileCore.createFile(path, source, id, f.FileName)
            if s != None:
                f.data.name = s
            f.allowedRoles.set(file.allowedRoles.all())
            f.save()
    return  copyRoot 

def DeleteFolderH(request, RefrenceFolder: models.Folder):

    for folder in RefrenceFolder.childrenfolders.all():
        models.Folder = DeleteFolderH(request, folder)
        
    for file in RefrenceFolder.childrenfiles.all():
        FileCore.delete_file(file.data.path)
        file.delete()
    RefrenceFolder.delete()
    return True 

def openFile(path, parentFolder, request):
    file = getFile(path, parentFolder, request.user)
    if file == None:
        return None
    print("path",file.data.path)
    return FileCore.openFile(file.data.path)

def deleteFile(request, path, parentFolder):
    file: models.File = getFile(path, parentFolder, request.user)
    if file == None:
        return False
    ok = FileCore.delete_file(file.data.path)
    if not ok: return False
    file.delete()
    return True

def deleteFolder(request, path, parentFolder):
    folder: models.Folder = getFolder(path, parentFolder, request.user)
    if folder == None:
        return False
    DeleteFolderH(request, folder)
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

def createFileCopy(path, file: models.File, request, Root, ID):
    try:
        with FileCore.openFile(file.data.path) as source:
            return createFile(path, Root, file.FileName, source, request.user,file.filetype,ID )
    except:
        return None
    

def createFile(path: str, ParentFolder: models.Folder, name: str, file, user: models.User, filetype: str, ID) -> models.File:
    target = getFolder(path, ParentFolder, user)
    neo = name
    i = 1
    while target.childrenfiles.filter(FileName=neo):
        neo = createCopyName(name, i)
        i+=1
    file_path = FileCore.createFile(path, file, ID ,neo)
    if file_path == None:
        return None
    model = models.File.objects.create(parentFolder=target, FileName= neo, filetype=filetype)
    model.data.name = file_path
    model.save()
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
        me['folders'] = {}
    
    if (ParentFolder.childrenfiles.exists()):
        me['files'] = {}
        for file in ParentFolder.childrenfiles.all():
            if not allowed(file, user):
                continue
            me['files'][file.FileName] = {
                "version": file.version,
                "type": file.filetype
            }
    else:
        me['files'] = None

    return me

def FileUpdater(file: models.File, data):
    FileCore.Modify(file.data.path, data)