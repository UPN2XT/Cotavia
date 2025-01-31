from django.http import HttpRequest, HttpResponseBadRequest
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.FilemangerForms import MoveForm, DeleteForm
from ..utils.filemanger import getFile, getFolder, copyFolder, deleteFile, deleteFolder, createCopyName, createFileCopy
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
   
    if type == "folder":
        x = target.FolederName
        i = 1
        neo = x
        while folder.childrenfolders.filter(FolederName=neo):
            neo = createCopyName(x, i)
            i+=1
        copy = copyFolder(request, target, id, to+f"/{neo}" if to!="" else neo)
        copy.parentFolder = folder
        copy.FolederName = neo
        copy.save()
        deleteFolder(request, From, project.rootFolder)
    
    else:
        neo = createFileCopy(to, target, request, project.rootFolder, id).FileName
        deleteFile(request, From, project.rootFolder)
        
    
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
        x = target.FolederName
        neo = x
        i = 1
        while folder.childrenfolders.filter(FolederName=neo):
            neo = createCopyName(x, i)
            i+=1
        copy = copyFolder(request, target, id, to+f"/{neo}" if to!="" else neo)
        copy.parentFolder = folder
        copy.FolederName = neo
        copy.save()
    elif type == "file":
        neo = target.FileName
        i = 1
        while folder.childrenfiles.filter(FileName=neo):
            neo = createCopyName(target.FileName, i)
            i+=1
        x: File = createFileCopy(to, target, request, project.rootFolder, id)
        if x == None:
            return ROLEDENIEDERROR
        x.limitedVisibility = target.limitedVisibility
        x.allowedRoles.set(target.allowedRoles.all())
        x.save()
    
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
