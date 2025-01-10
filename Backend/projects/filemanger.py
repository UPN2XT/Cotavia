from . import models


def createFolder(path: str, ParentFolder: models.Folder, name: str) -> models.Folder:
    target = getFolder(path, ParentFolder)
    model = models.Folder.objects.create(FolederName=name, parentFolder=target)
    return model

def createFile(path: str, ParentFolder: models.Folder, name: str, data: str) -> models.File:
    target = getFolder(path, ParentFolder)
    model = models.File.objects.create(data= data, parentFolder=target, FileName= name)
    return model

def getFolder(path: str, ParentFolder: models.Folder) -> models.Folder:
    if not path:
        return ParentFolder
    currentFolder = ParentFolder
    nodes = path.split('/')
    for node in nodes:
        currentFolder = currentFolder.childrenfolders.get(FolederName=node)
    return currentFolder

def getFile(path: str, ParentFolder: models.Folder) -> models.File:
    if not path:
        return None
    
    *nodes, file = path.split('/')
    target = getFolder('/'.join(nodes), ParentFolder)
    return target.childrenfiles.get(FileName=file)

def createPathTree(ParentFolder: models.Folder) -> dict:
    me: dict = {'name': ParentFolder.FolederName}
    if (ParentFolder.childrenfolders.exists()):
        me['folders'] = {}
        for folder in ParentFolder.childrenfolders.all():
            me['folders'][folder.FolederName] = createPathTree(folder)
    else:
        me['folders'] = None
    
    if (ParentFolder.childrenfiles.exists()):
        me['files'] = {}
        for file in ParentFolder.childrenfiles.all():
            me['files'][file.FileName] = file.data
    else:
        me['files'] = None

    return me