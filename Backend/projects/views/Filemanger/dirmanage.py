from django.http import HttpRequest
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.FilemangerForms import DirRequestForm
from ..utils.filemanger import createFolder, createFile, getFile
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ...models import Project, File

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
    analysis = requestCheck(request, DirRequestForm, ["path", "ID", "name", "data"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    name = analysis["name"]
    data = analysis["data"]

    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    f = createFile(path, project.rootFolder, name, data, request.user)
    if f == None:
        return ROLEDENIEDERROR
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "update/file",
        "path": path,
        "data": data,
        "name": f.FileName
    })
    return SucessMessage
    

def updateFile(request: HttpRequest):
    analysis = requestCheck(request, DirRequestForm, ["path", "ID", "data"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    data = analysis["data"]

    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    project: Project = request.user.projectsin.filter(id = id).first()
    file: File = getFile(path, project.rootFolder, request.user)
    if file == None:
        return ROLEDENIEDERROR
    file.data = data
    file.save()
    *path, name = path.split('/')
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "update/file",
        "path": "/".join(path),
        "data": data,
        "name": name
    })
    return SucessMessage