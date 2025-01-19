from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponse
from ..models import Project, Folder, File, Role
from .utils.filemanger import createPathTree, getFile, createFolder, createFile
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send)

def createDoc(project: Project, user):
    return JsonResponse({
        'id': project.id,
        'filePath': createPathTree(project.rootFolder, user)
    })

# Project Interface

# Gets the most upto date version of the Project

def getProjects(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    projectsList = {}
    projects = request.user.projectsin.all()
    for project in projects:
        projectsList[project.projectName] = str(project.id)
    return JsonResponse(projectsList, safe=False)

# create new Project

def createProject(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    name = request.POST.get("name")
    folder = Folder.objects.create(FolederName=name)
    project = Project.objects.create(projectName=name, rootFolder=folder)
    project.user.add(request.user)
    role1 = Role.objects.create(project=project, isAdmin=True)
    role2 = Role.objects.create(project=project, isAdmin=False, roleName="default")
    project.defaultrole = role2
    project.creatorole = role1
    project.save()
    role1.users.add(request.user)
    return createDoc(project, request.user)

def UpdateProjectCoreSettings(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    id = request.POST.get("ID")
    name = request.POST.get("name")
    project: Project = request.user.projectsin.filter(id = id).first()
    if not Role.objects.filter(project=project, users=request.user, isAdmin=True).exists():
        return HttpResponseForbidden()
    project.projectName = name
    project.save()
    rootFolder = project.rootFolder
    rootFolder.FolederName = name
    rootFolder.save()
    return HttpResponse()

def createFolderRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    
    path = request.POST.get('path')
    id = request.POST.get('ID')
    name = request.POST.get('name')
    project: Project = request.user.projectsin.filter(id = id).first()
    folder = createFolder(path, project.rootFolder, name, request.user)
    if folder == None:
        return HttpResponseForbidden()
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "create/folder",
        "path": path,
        "name": name,
    })
    return HttpResponse()

def createFileRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    
    path = request.POST.get('path')
    id = request.POST.get('ID')
    name = request.POST.get('name')
    data = request.POST.get('data')
    project: Project = request.user.projectsin.filter(id = id).first()
    f = createFile(path, project.rootFolder, name, data, request.user)
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "update/file",
        "path": path,
        "data": data,
        "name": name
    })
    if f == None:
        return HttpResponseForbidden()
    return HttpResponse()
    

# basic implementaion to be updated

def updateFile(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    
    id = request.POST.get("ID")
    path = request.POST.get('path')
    data = request.POST.get("data")
    project: Project = request.user.projectsin.filter(id = id).first()
    file: File = getFile(path, project.rootFolder, request.user)
    if file == None:
        return HttpResponseForbidden
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
    return HttpResponse()

def getProject(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    id = request.POST.get("ID")
    project = request.user.projectsin.filter(id = id).first()
    return createDoc(project, request.user)


    


    

