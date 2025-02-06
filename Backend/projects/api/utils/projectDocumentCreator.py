from ...models import Project, Folder, User
from .common.allowedAcess import allowed

def createPathTree(ParentFolder: Folder, user: User) -> dict:
    me: dict = {'name': ParentFolder.name, "UUID": str(ParentFolder.UUID)}
    if (ParentFolder.childrenfolders.exists()):
        me['folders'] = {}
        folder: Folder = None
        for folder in ParentFolder.childrenfolders.all():
            if not allowed(folder, user):
                continue
            me['folders'][folder.name] = createPathTree(folder, user)
    else:
        me['folders'] = {}
    
    if (ParentFolder.childrenfiles.exists()):
        me['files'] = {}
        for file in ParentFolder.childrenfiles.all():
            if not allowed(file, user):
                continue
            me['files'][file.name] = {
                "version": file.version,
                "type": file.filetype,
                "UUID": str(file.UUID)
            }
    else:
        me['files'] = {}

    return me

def createDoc(project: Project, user):
    return {
        'id': project.id,
        'filePath': createPathTree(project.rootFolder, user),
    }