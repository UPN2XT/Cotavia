from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponse
from .models import Project, Folder, File
from .filemanger import createPathTree, getFile, createFolder, createFile

def createDoc(project: Project):
    return JsonResponse({
        'id': project.id,
        'filePath': createPathTree(project.rootFolder)
    })


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


def createProject(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    name = request.POST.get("name")
    folder = Folder.objects.create(FolederName=name)
    project = Project.objects.create(projectName=name, rootFolder=folder)
    project.user.add(request.user)
    return createDoc(project)
    

def createFolderRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    
    path = request.POST.get('path')
    id = request.POST.get('ID')
    name = request.POST.get('name')
    project: Project = request.user.projectsin.filter(id = id).first()
    createFolder(path, project.rootFolder, name)
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
    createFile(path, project.rootFolder, name, data)
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
    file: File = getFile(path, project.rootFolder)
    file.data = data
    file.save()
    return HttpResponse()

def getProject(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    id = request.POST.get("ID")
    project = request.user.projectsin.filter(id = id).first()
    return createDoc(project)


    


    

