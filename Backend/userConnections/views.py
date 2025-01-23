from .models import Profile, User, ConnectionRequest
from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponse, HttpResponseBadRequest
from projects.views.utils.basicCheck import requestCheck, SucessMessage, basicCheck
from .forms import handleConnectionRequestFrom

def createProfileData(profile: Profile):
    return {
        "Displayname": profile.displayName,
        "pfp": profile.pfp.url,
        "username": profile.user.username
    }

def getProfile(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    username = request.POST.get("username")
    target = User.objects.filter(username=username)
    return JsonResponse(createProfileData(target.userprofile.all().first()))

def getUserProfile(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        res: HttpResponse = HttpResponse()
        res.status_code = 401
        return res
    return JsonResponse(createProfileData(request.user.userprofile.all().first()))

def updateProfile(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    profile: Profile = request.user.userprofile.get()
    displayName = request.POST.get("displayname")
    pfp = request.FILES['pfp']
    if profile:
        profile.displayName = displayName
        profile.pfp.save(pfp.name, pfp)
        profile.save()
    return HttpResponse()

def sendConnectionRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    username = request.POST.get('username')
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponseBadRequest("{error: 'user could not be found'}")
    request.user.userprofile.outgoingrequest.add(user)
    user.userprofile.get().incomingrequests.add(user)
    return HttpResponse()

def getTargetProfile(request, mode, username, userProfile):
    try:
        if mode == "i":
            return ConnectionRequest.objects.get(To=userProfile, From__user__username=username)
        elif mode=="o":
            return ConnectionRequest.objects.get(From=userProfile, To__user__username=username)
        elif mode=="c":
            return request.user.userprofile.get().connections.get(user__username=username)
        else:
            return User.objects.filter(username=username).first().userprofile.get()
    except:
        return None

def handleRelation(request, mode, username, accept):
    userProfile: Profile = request.user.userprofile.get()
    target: Profile = getTargetProfile(request, mode, username, userProfile)
    if target == None:
        return HttpResponseBadRequest("{error: 'target not found'}")
    if mode == "i" or mode=="o":
        if accept == 'T' and mode == "i":
            userProfile.connections.add(target.From)
        target.delete()
    elif mode == 'c':
        userProfile.connections.remove(target)
    else:
        ConnectionRequest.objects.create(To=target, From=userProfile)

def handleConnectionRequest(request: HttpRequest):
    analysis = requestCheck(request, handleConnectionRequestFrom, ["accept", "mode", "username"])
    if analysis["error"]:
        return analysis["errorResponse"]
    mode: str = analysis["mode"]
    username: str = analysis["username"]
    accept: str = analysis["accept"]
    handleRelation(request, mode, username, accept)
    return SucessMessage

def getRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    reqsList = {}
    mode = request.POST.get("mode")
    if mode == None:
        return HttpResponseBadRequest('{error: "invalid request"}')
    my_profile = Profile.objects.get(user=request.user)
    if mode == 'i':
        reqs = Profile.objects.filter(outgoingrequest__To=my_profile)
    elif mode == 'o':
        reqs = Profile.objects.filter(incomingrequests__From=my_profile)
    else:
        reqs = request.user.userprofile.get().connections.all()
    for r in reqs:
        reqsList[str(r.user.username)] = createProfileData(r)
        
    return JsonResponse(reqsList)

def search(request: HttpRequest):
    if not basicCheck(request, "POST"):
        return HttpResponseForbidden('{error: "un autherized access"}')
    find = request.POST.get('query')
    if find == None:
        return HttpResponseBadRequest('{error: "invalid request"}')
    Users = User.objects.filter(
        username__contains=find).exclude(username=request.user.username)
    data = {}
    my_profile = request.user.userprofile.get()
    for user in Users:
        profile: Profile = user.userprofile.get()
        # check the relation between the searched profiles and request user profile
        if my_profile.connections.filter(user=user).exists():
            continue
        elif profile.outgoingrequest.filter(From__user=user).exists():
            continue
        elif profile.incomingrequests.filter(To__user=user).exists():
            continue

        pfdata = {
            "displayname": profile.displayName,
            "pfp": str(profile.pfp.url),
        }
        data[user.username] = pfdata
    return JsonResponse(data)






    


        
