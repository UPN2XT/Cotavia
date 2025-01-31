from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponseBadRequest
from ...models import Project, Role
from ..utils.basicCheck import requestCheck, getProject, modificationAllowed ,PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage, modificationAllowed
from ...forms.ProjectSettings.userSettingsForms import RoleUpdate, GetUsersRoleInfo, UpdateUserInRoleForm, DirRoleForm
from ...forms.projectAcessForms import IdAcessForm
from .usersUpdate import createUserList
from ..utils.filemanger import getFile, getFolder
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send)

def reloadEvent(id):
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "role/change/reload"
    })


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
    analysis = requestCheck(request, RoleUpdate, ["ID", "action", "data"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    action: str = analysis["action"]
    data: str = analysis["data"]
    project: Project = getProject(id, request)
    if project == None:
        return PROJECTNOTFOUNDERROR
    if not modificationAllowed(request, project):
        return ROLEDENIEDERROR
    return actionHandler(action, data, project)
    
def actionHandler(action, data, project):
    if action == "create":
        return createNewRole(data, project)
    try:
        role: Role = project.projectroles.get(roleName=data["name"])
    except:
        return HttpResponseBadRequest("{error: 'role could not be found'}")
    if role == project.creatorole:
        return HttpResponseForbidden("{error: 'Trying to delete alter the cretor role'}")
    if action == "update":
        return updateRoleInfo(role, data, project.id)
    if action == "delete":
        if project.defaultrole == role:
            return HttpResponseForbidden("{error: 'Trying to delete default role'}")
        return deleteRole()
    return HttpResponseBadRequest("{error: 'action not found'}")

def deleteRole(role: Role, project): 
    project.projectroles.remove(role)
    role.delete()
    reloadEvent(id)
    return SucessMessage


def updateRoleInfo(role: Role, data, id):
    role.isAdmin = data["isAdmin"]
    role.canCreate = data["canCreate"]
    role.canDelete = data["canDelete"]
    role.canModifyFiles = data["canModifyFiles"]
    role.save()
    reloadEvent(id)
    return SucessMessage

def createNewRole(data, project):
    if project.projectroles.filter(roleName=data["name"]).exists():
        return HttpResponseBadRequest()
    role: Role = Role(
        isAdmin=data["isAdmin"], canCreate=data["canCreate"],
        canDelete=data["canDelete"], canModifyFiles=data["canModifyFiles"],
        roleName=data["name"], project=project)
    role.save()
    reloadEvent(project.id)
    return SucessMessage

def basicCheck1(request: HttpRequest, id, name):
    project: Project = getProject(id, request)
    if project == None:
        return False, PROJECTNOTFOUNDERROR, None
    if not modificationAllowed(request, project):
        return False, ROLEDENIEDERROR, None
    try:
        role: Role = project.projectroles.get(roleName=name)
    except:
        role = None
    if role == None:
        return False, HttpResponseBadRequest("{error: 'Role not Found'}"), None
    return True, project, role

def getUserRelatedRoles(request: HttpRequest):
    analysis = requestCheck(request, GetUsersRoleInfo, ["ID", "name"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    name: str = analysis["name"]
    ok, project, role = basicCheck1(request, id, name)
    if not ok:
        return project
    project: Project = project
    role: Role = role
    usersIn = role.users.all()
    usersOut = project.user.exclude(userRoles=role)
    return JsonResponse({
        "usersIn": createUserList(usersIn),
        "usersOut": createUserList(usersOut)
    })

def handleUserInRole(request):
    analysis = requestCheck(request, UpdateUserInRoleForm, ["ID", "name", "username", "action"])
    if analysis["error"]:
        return analysis["errorResponse"]
    id = analysis["ID"]
    name: str = analysis["name"]
    username: str = analysis["username"]
    action: str = analysis["action"]
    ok, project, role = basicCheck1(request, id, name)
    if not ok:
        return project
    project: Project = project
    role: Role = role
    
    if action == "remove":
        user = role.users.filter(username=username).first()
        if user == None:
            return HttpResponseBadRequest("{error: 'User not found'}")
        role.users.remove(user)
    elif action == "add":
        user = project.user.filter(username=username).first()
        if user == None:
            return HttpResponseBadRequest("{error: 'User not found'}")
        role.users.add(user)
    else:
        HttpResponseBadRequest("{erorr: 'Action not valid'}")
    reloadEvent(id)
    return SucessMessage

def basicCheck3(request: HttpRequest, update):
    analysis = requestCheck(request, DirRoleForm, ["ID", "name", "path", "type", "action"] if update else ["ID", "name", "path", "type"])
    if analysis["error"]:
        return False, analysis["errorResponse"], None, None, None, None, None, None
    id = analysis["ID"]
    name: str = analysis["name"]
    path: str = analysis["path"]
    type: str = analysis["type"]
    action: str = analysis["action"] if update else "" 
    project: Project = getProject(id, request)
    if not project:
        return False, PROJECTNOTFOUNDERROR, None, None, None, None, None, None
    if not modificationAllowed(request, project):
        return False, ROLEDENIEDERROR, None, None, None, None, None, None
    if type == "folder":
        target = getFolder(path, project.rootFolder, request.user)
    elif type == "file":
        target = getFile(path,project.rootFolder, request.user)
    else:
        return False, HttpResponseBadRequest("{error: 'wrong type'}"), None, None, None, None, None, None
    if target == None:
        return False, ROLEDENIEDERROR, None, None, None, None, None, None
    return True, project, type, name, action, target, path, id
    
def getRoleRelatedToDir(request: HttpRequest):
    ok, project, type, name, action, target, path, id = basicCheck3(request, False)
    if not ok:
        return project
    if target.limitedVisibility == True:
        accessRoleName = target.allowedRoles.filter(users=request.user, isAdmin=True).first().roleName
    else:
        accessRoleName = ""
    if type == "folder":
        rolesIn = target.allowedRoles.all().exclude(roleName=accessRoleName)
        rolesOut = project.projectroles.exclude(roleconnnectedfolders=target)
    elif type == "file":
        rolesIn = target.allowedRoles.all().exclude(roleName=accessRoleName)
        rolesOut = project.projectroles.exclude(roleconnnectedfiles=target)
    else: 
        return HttpResponseBadRequest("{error: 'wrong type'}")
    
    In = []
    for role in rolesIn:
        In.append(role.roleName)
    Out = []
    for role in rolesOut:
        Out.append(role.roleName)

    return JsonResponse({
        "limited": target.limitedVisibility,
        "rolesIn": In,
        "rolesOut": Out
    })

def editRoleRelationWithDir(request: HttpRequest):
    ok, project, Type, name, action, target, path, id = basicCheck3(request, True)
    if not ok:
        return project
    try:
        role: Role = project.projectroles.get(roleName=name)
    except:
        return HttpResponseBadRequest("{error: 'ivalid role'}")
    if action == "remove":
        if target.allowedRoles.filter(isAdmin=True).count() < 2:
            return HttpResponseBadRequest("{error: 'trying to remove only role'}")
        target.allowedRoles.remove(role)
    elif action == "add":
        target.allowedRoles.add(role)
    else:
        return HttpResponseBadRequest('{error: "invalid action"}')
    
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": f"role/change",
        "path": path,
        "Type": Type
    })

    return SucessMessage

def editVisiblity(request: HttpRequest):
    ok, project, Type, name, action, target, path, id = basicCheck3(request, True)
    if not ok:
        return project

    elif action=="T":
        if target.allowedRoles.count() == 0 or not target.allowedRoles.filter(users=request.user):
            adminRole = project.projectroles.filter(users=request.user, isAdmin=True).first()
            target.allowedRoles.add(adminRole)
        target.limitedVisibility = True
        target.save()
    else:
        target.limitedVisibility = False
        target.save()
    
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": f"role/change",
        "path": path,
        "Type": Type
    })

    return SucessMessage
    


    