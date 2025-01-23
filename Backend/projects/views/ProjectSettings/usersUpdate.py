from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponse
from ...models import Project, Role
from ..utils.basicCheck import requestCheck, getProject, PROJECTNOTFOUNDERROR, ROLEDENIEDERROR, SucessMessage
from ...forms.projectAcessForms import IdAcessForm
from ...forms.ProjectSettings.userSettingsForms import UpdateUsersForm
from userConnections.models import Profile, User


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()
groupSend = async_to_sync(channel_layer.group_send)

def deleteEvent(id, username):
    groupSend(f"project_{id}", {
        "type": "project.update",
        "event": "delete/User",
        "username": username
    })

def createUserList(users):
    data = {}
    for user in users:
        profile: Profile = user.userprofile.get()
        data[user.username] = {
            "displayname": profile.displayName,
            "pfp": profile.pfp.url
        }
    return data

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
    return JsonResponse(createUserList(users))
    
def getConnectionsOutside(request:HttpRequest):
    (ok, o2) = basicAnalsis(request)
    if not ok:
        return o2
    project: Project = o2
    userProfile: Profile = request.user.userprofile.get()
    connectedUsers = User.objects.filter(userprofile__connections=userProfile)
    usersNotInProject = connectedUsers.exclude(id__in=project.user.all())
    return JsonResponse(createUserList(usersNotInProject))

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
    try:
        user: User = request.user.userprofile.get().connections.get(user__username=username).user
    except:
        return HttpResponseBadRequest("{error: 'user not found'}")
    if project.user.filter(username=user.username).exists():
        return HttpResponseForbidden("{error: 'User is already added'}")
    project.user.add(user)
    project.defaultrole.users.add(user)
    return SucessMessage

def removeUser(request: HttpRequest):
    (ok, username, project) = basicAnalsis2(request)
    if not ok:
        return project
    try:
        user = project.user.get(username=username)
    except:
        return HttpResponseBadRequest("{error: 'user not found'}")
    if user == None:
        return HttpResponseBadRequest()
    project.user.remove(user)
    roles = project.projectroles.filter(users=user)
    for role in roles:
        role.users.remove(user)
    deleteEvent(project.id, user.username)
    return SucessMessage



