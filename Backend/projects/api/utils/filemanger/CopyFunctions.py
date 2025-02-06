from .GetFunctions import get_file, get_folder, Folder, File
from ..common.allowedAcess import allowed

def copyFile(TargetFolderUUID, TargetFileUUID, project, user):
    ok, newParent = get_folder(TargetFolderUUID, project, user)
    ok2, file = get_file(TargetFileUUID, project, user)
    if (not ok) or (not ok2):
        return False, f"{file} ok1" if not ok2 else f"{newParent} ok2", None, None, None
    neoFile = file.copy(newParent, user)

    return True, neoFile.name, str(neoFile.UUID), newParent.UUID, file.UUID

def copyLoop(Ref:Folder, parent:Folder, user, UUIDData):
    newFolder = Ref.copy(parent, user)
    UUIDData[str(Ref.UUID)] = str(newFolder.UUID)
    folders = Ref.childrenfolders.all()
    files = Ref.childrenfiles.all()
    for folder in folders:
        if not allowed(folder, user):
            continue
        copyLoop(folder, newFolder, user, UUIDData)
    for file in files:
        if not allowed(file, user):
            continue
        f = file.copy(newFolder, user)
        UUIDData[str(file.UUID)] = str(f.UUID)
    return newFolder.name
            

def copyFolder(TargetParentUUID, TargetFolderUUID, project, user):
    ok, newParent = get_folder(TargetParentUUID, project, user)
    ok2, folder = get_folder(TargetFolderUUID, project, user)
    if (not ok) or (not ok2):
        return False, folder if not ok2 else newParent, None, None, None
    UUIDData = {}
    name = copyLoop(folder, newParent, user, UUIDData)
    return True, name, UUIDData, newParent.UUID, folder.UUID
    