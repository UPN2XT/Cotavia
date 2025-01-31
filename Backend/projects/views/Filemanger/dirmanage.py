from django.http import HttpRequest, FileResponse
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.FilemangerForms import DirRequestForm, FileCreationForm, FileGetterForm, FileCreationForm, FileUpdateForm
from ..utils.filemanger import createFolder, createFile, getFile, openFile, FileUpdater
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ...models import Project, File
import json

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send) # Channel sending method rappers

def createFolderRequest(request: HttpRequest):
    analysis = requestCheck(request, DirRequestForm, ["path", "ID", "name"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    name = analysis["name"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    folder = createFolder(path, project.rootFolder, name, request.user)
    if folder == None:
        return ROLEDENIEDERROR
    
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "create/folder",
        "path": path,
        "name": folder.FolederName,
    })
    return SucessMessage

def createFileRequest(request: HttpRequest):
    analysis = requestCheck(request, FileCreationForm, ["path", "ID", "name", "data", "Type"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    name = analysis["name"]
    data = analysis["data"]
    Type = analysis["Type"]

    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    f = createFile(path, project.rootFolder, name, data, request.user, Type, id)
    if f == None:
        return ROLEDENIEDERROR
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "update/file",
        "path": path,
        "data": json.dumps({
            "version": f.version,
            "type": f.filetype
        }),
        "name": f.FileName
    })
    return SucessMessage
    

def updateFile(request: HttpRequest):
    analysis = requestCheck(request, FileUpdateForm, ["path", "ID", "data", "Type"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    data = analysis["data"]
    Type = analysis["Type"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    project: Project = request.user.projectsin.filter(id = id).first()
    file: File = getFile(path, project.rootFolder, request.user)
    if file == None:
        return ROLEDENIEDERROR
    file.version += 1
    FileUpdater(file, data)
    file.filetype = Type
    file.save()
    *path, name = path.split('/')
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "update/file",
        "path": "/".join(path),
        "data": {
            "version": file.version,
            "type": Type
        },
        "name": name
    })
    return SucessMessage

def getFileRequest(request):
    analysis = requestCheck(request, FileGetterForm, ["path", "ID"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]

    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    file = openFile(path, project.rootFolder, request)
    if file == None:
        return ROLEDENIEDERROR
    
    return FileResponse(file)
    
