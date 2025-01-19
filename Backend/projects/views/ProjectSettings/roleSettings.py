from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponseBadRequest
from ...models import Project, Role
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.ProjectSettings.userSettingsForms import RoleUpdate
from ...forms.projectAcessForms import IdAcessForm

def getRoles(request: HttpRequest):
    analysis = requestCheck(request, IdAcessForm, ["ID"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    roles = project.projectroles.all()
    data = {}
    for role in roles:
        if project.creatorole == role:
            continue
        data[role.roleName] = {
            "isAdmin": role.isAdmin,
            "canCreate": role.canCreate,
            "canDelete": role.canDelete,
            "canModifyFiles": role.canModifyFiles,
            "isDefualt": project.defaultrole == role
        }
    return JsonResponse(data)

def updateRole(request: HttpRequest):
    analysis = requestCheck(request, RoleUpdate, ["name"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    action: str = analysis["action"]
    data: str = analysis["data"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    if not Role.objects.filter(project=project, users=request.user, isAdmin=True).exists():
        return ROLEDENIEDERROR
    return actionHandler(action, data, project)
    
def actionHandler(action, data, project):
    if action == "create":
        return createNewRole(data, project)
    role: Role = project.projectroles.filter(roleName=data["name"]).first()
    if role == project.creatorole:
        return HttpResponseForbidden("{error: 'Trying to delete alter the cretor role'}")
    if action == "update":
        return updateRoleInfo(role, data)
    if action == "delete":
        if project.defaultrole == role:
            return HttpResponseForbidden("{error: 'Trying to delete default role'}")
        return deleteRole()
    return HttpResponseBadRequest("{error: 'action not found'}")

def deleteRole(role: Role, project): 
    project.projectroles.remove(role)
    role.delete()
    return SucessMessage


def updateRoleInfo(role: Role, data):
    role.isAdmin = data["isAdmin"]
    role.canCreate = data["canCreate"]
    role.canDelete = data["canDelete"]
    role.canModifyFiles = data["canModifyFiles"]
    role.save()
    return SucessMessage

def createNewRole(data, project):
    if project.projectroles.filter(roleName=data["name"]).exists():
        return HttpResponseBadRequest()
    role: Role = Role(
        isAdmin=data["isAdmin"], canCreate=data["canCreate"],
        canDelete=data["canDelete"], canModifyFiles=data["canModifyFiles"],
        roleName=data["name"], project=project)
    role.save()
    return SucessMessage
