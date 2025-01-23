from django.http import HttpRequest, HttpResponseBadRequest
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.FilemangerForms import MoveForm, DeleteForm
from ..utils.filemanger import getFile, getFolder, copyFolder, deleteFile, deleteFolder, createCopyName
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ...models import Project, File

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send) # Channel sending method rappers

def Move(request: HttpRequest):
    analysis = requestCheck(request, MoveForm, ["From", "ID", "To", "type"])
    if analysis["error"]:
        return analysis["errorResponse"]
    From = analysis["From"]
    id = analysis["ID"]
    to = analysis["To"]
    type = analysis["type"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    if type == "folder":
        target = getFolder(From, project.rootFolder, request.user)
    elif type == "file": 
        target = getFile(From, project.rootFolder, request.user)
    else: return HttpResponseBadRequest("{error: 'wrong type'}")
    if target == None:
        return ROLEDENIEDERROR
    folder = getFolder(to, project.rootFolder, request.user)
    if folder == None:
        return ROLEDENIEDERROR
    target.parentFolder = folder
    if type == "folder":
        neo = target.FolederName
        i = 1
        while folder.childrenfolders.filter(FolederName=neo):
            neo = createCopyName(target.FolederName, i)
            i+=1
        target.FolederName = neo
    else:
        neo = target.FileName
        i = 1
        while folder.childrenfiles.filter(FileName=neo):
            neo = createCopyName(target.FileName, i)
            i+=1
        target.FileName = neo
    target.save()
    
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": f"cut/{type}",
        "from": From,
        "to": to,
        "name": neo
    })
    return SucessMessage

def Copy(request: HttpRequest):
    analysis = requestCheck(request, MoveForm, ["From", "ID", "To", "type"])
    if analysis["error"]:
        return analysis["errorResponse"]
    From = analysis["From"]
    id = analysis["ID"]
    to = analysis["To"]
    type = analysis["type"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    if type == "folder":
        target = getFolder(From, project.rootFolder, request.user)
    elif type == "file": 
        target = getFile(From, project.rootFolder, request.user)
    else: return HttpResponseBadRequest("{error: 'wrong type'}")
    if target == None:
        return ROLEDENIEDERROR
    folder = getFolder(to, project.rootFolder, request.user)
    if folder == None:
        return ROLEDENIEDERROR
    if type == "folder":
        copy = copyFolder(request, target)
        copy.parentFolder = folder
        neo = copy.FolederName
        i = 1
        while folder.childrenfolders.filter(FolederName=neo):
            neo = createCopyName(copy.FolederName, i)
            i+=1
        copy.FolederName = neo
        copy.save()
    elif type == "file":
        neo = target.FileName
        i = 1
        while folder.childrenfiles.filter(FileName=neo):
            neo = createCopyName(target.FileName, i)
            i+=1
        x = File.objects.create(FileName=neo, parentFolder=folder,
            data=target.data, limitedVisibility=target.limitedVisibility)
        x.allowedRoles.set(target.allowedRoles.all())
    
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": f"copy/{type}",
        "from": From,
        "to": to,
        "name": neo
    })
    return SucessMessage

def Delete(request: HttpRequest):
    analysis = requestCheck(request, DeleteForm, ["path", "ID", "type"])
    if analysis["error"]:
        return analysis["errorResponse"]
    path = analysis["path"]
    id = analysis["ID"]
    type = analysis["type"]

    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    
    if type == "folder":
        ok = deleteFolder(request, path, project.rootFolder)
    elif type == "file":
        ok = deleteFile(request, path, project.rootFolder)
    else: return HttpResponseBadRequest("{error: 'wrong type'}")

    if not ok:
        return ROLEDENIEDERROR

    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": f"delete/{type}",
        "path": path,
    })
    return SucessMessage
