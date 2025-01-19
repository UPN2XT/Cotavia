from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponse
from ...models import Project, Role
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.projectAcessForms import IdAcessForm
from ...forms.ProjectSettings.userSettingsForms import UpdateUsersForm
from userConnections.models import Profile, User

def createUserList(users):
    data = {}
    for user in users:
        profile: Profile = user.userprofile.get()
        data[user.username] = {
            "displayname": profile.displayName,
            "pfp": profile.pfp.url
        }
    return JsonResponse(data)

def basicAnalsis(request: HttpRequest):
    analysis = requestCheck(request, IdAcessForm, ["ID"])
    if analysis["error"]:
        return False, analysis["errorResponse"]
    id = analysis["ID"]
    project: Project = getProject(id, request)
    if project == None:
        return False, PROJECTNOTFOUNDERROR
    return True, project

def getUsers(request: HttpRequest):
    (ok, o2) = basicAnalsis(request)
    if not ok:
        return o2
    project: Project = o2
    users = project.user.exclude(username=request.user.username)
    return createUserList(users)
    
def getConnectionsOutside(request:HttpRequest):
    (ok, o2) = basicAnalsis(request)
    if not ok:
        return o2
    project: Project = o2
    userProfile: Profile = request.user.userprofile.get()
    connectedUsers = User.objects.filter(userprofile__connections=userProfile)
    usersNotInProject = connectedUsers.exclude(id__in=project.user.all())
    return createUserList(usersNotInProject)

def basicAnalsis2(request: HttpRequest):
    analysis = requestCheck(request, UpdateUsersForm, ["username", "ID"])
    if analysis["error"]:
        return False, None, analysis["errorResponse"]
    id = analysis["ID"]
    username = analysis["username"]
    project: Project = getProject(id, request)
    if project == None: return False, None, PROJECTNOTFOUNDERROR
    if not Role.objects.filter(project=project, users=request.user, isAdmin=True).exists():
        return False, None, ROLEDENIEDERROR
    return True, username, project

def AddUser(request: HttpRequest):
    (ok, username, project) = basicAnalsis2(request)
    if not ok:
        return project
    user: User = request.user.userprofile.get().connections.filter(user__username=username).first().user
    if project.user.filter(username=user.username).exists():
        return HttpResponseForbidden("{error: 'User is already added'}")
    project.user.add(user)
    project.defaultrole.users.add(user)
    return SucessMessage

def removeUser(request: HttpRequest):
    (ok, username, project) = basicAnalsis2(request)
    if not ok:
        return project
    user = project.user.filter(username=username).first()
    if user == None:
        return HttpResponseBadRequest()
    project.user.remove(user)
    roles = project.projectroles.filter(users=user)
    for role in roles:
        role.users.remove(user)
    return SucessMessage



