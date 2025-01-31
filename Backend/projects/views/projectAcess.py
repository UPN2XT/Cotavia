from django.http import HttpRequest, JsonResponse, HttpResponseBadRequest
from ..models import Project, Folder, Role
from .utils.filemanger import createPathTree
from .utils.basicCheck import basicCheck, requestCheck, getProject, PROJECTNOTFOUNDERROR
from ..forms.projectAcessForms import createProjectForm, IdAcessForm
from rest_framework.views import APIView


def createDoc(project: Project, user):
    return JsonResponse({
        'id': project.id,
        'filePath': createPathTree(project.rootFolder, user),
    })

def getProjects(request: HttpRequest):
    if not basicCheck(request, "POST"):
        return HttpResponseBadRequest("{'error': 'bad Request'}")
    projectsList = {}
    projects = request.user.projectsin.all()
    for project in projects:
        projectsList[project.projectName] = str(project.id)
    return JsonResponse(projectsList, safe=False)

def createProject(request: HttpRequest):
    analysis = requestCheck(request, createProjectForm, ["name"])
    if analysis["error"]:
        return analysis["errorResponse"]
    name = analysis["name"]
    folder = Folder.objects.create(FolederName=name) # root folder
    project = Project.objects.create(projectName=name, rootFolder=folder)
    project.user.add(request.user)
    role1 = Role.objects.create(project=project, isAdmin=True, roleName="creator") # admin role
    role2 = Role.objects.create(project=project, isAdmin=False, roleName="default") # default role
    project.defaultrole = role2
    project.creatorole = role1
    project.save()
    role1.users.add(request.user)
    return createDoc(project, request.user)

def getProjectData(request: HttpRequest):
    analysis = requestCheck(request, IdAcessForm, ["ID"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    return createDoc(project, request.user)

def getPermisionInfo(request: HttpRequest):
    analysis = requestCheck(request, IdAcessForm, ["ID"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    user = request.user
    admin : bool = project.projectroles.filter(isAdmin=True, users=user).exists()
    return JsonResponse({
        'isAdmin': admin,
        'canCreate': admin or project.projectroles.filter(canCreate=True, users=user).exists(),
        'canDelete': admin or project.projectroles.filter(canDelete=True, users=user).exists(),
        'canModifyFiles': admin or project.projectroles.filter(canModifyFiles=True, users=user).exists()
    })
