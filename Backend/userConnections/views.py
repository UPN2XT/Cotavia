from .models import Profile, User
from django.http import HttpRequest, HttpResponseForbidden, JsonResponse, HttpResponse, HttpResponseBadRequest


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
        return HttpResponseForbidden()
    return JsonResponse(createProfileData(request.user.userprofile.all().first()))

def updateProfile(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    profile: Profile = request.user.userprofile.all().first()
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
    user = User.objects.filter(username=username).first()
    request.user.userprofile.outgoingrequest.add(user)
    request.user.save()
    return HttpResponse()

def handleConnectionRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    username = request.POST.get('username')
    accept = request.POST.get('accept')
    mode = request.POST.get('mode')
    if mode == "i":
        ps = request.user.userprofile.get().incomingrequests.all()
    elif mode=="o":
        ps = request.user.userprofile.get().outgoingrequest.all()
    else:
        ps = request.user.userprofile.get().connections.all()
    target = None
    for p in ps:
        if p.user.username == username:
            target = p
            break
    if target == None:
        return HttpResponseBadRequest()
    if accept == 'T' and mode == "i":
        request.user.userprofile.get().connections.add(target)
    if mode == "i":
        request.user.userprofile.get().incomingrequests.remove(target)
    elif mode == 'o':
        request.user.userprofile.get().outgoingrequest.remove(target)
    else:
        request.user.userprofile.get().connections.remove(target)
    return HttpResponse()

def getRequest(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseForbidden()
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    reqsList = {}
    mode = request.POST.get("mode")
    if mode == 'i':
        reqs = request.user.userprofile.get().incomingrequests.all()
    elif mode == 'o':
        reqs = request.user.userprofile.get().outgoingrequest.all()
    else:
        reqs = request.user.userprofile.get().connections.all()
    for r in reqs:
        reqsList[str(r.user.username)] = createProfileData(r)
        
    return JsonResponse(reqsList)

def search(request: HttpRequest):
    find = request.POST.get('find')
    Users = User.objects.filter(
        username__contains=find).exclude(username=request.user.username)
    data = {}
    my_profile = request.user.userprofile.all().first()
    for user in Users:
        profile = user.userprofile.all().first()
        # check the relation between the searched profiles and request user profile
        if my_profile in profile.connections.all():
            mode = "Remove Connection"
        elif my_profile in profile.outgoingrequest.all():
            mode = "Accept Connection"
        elif my_profile in profile.incomingrequests.all():
            mode = "Cancel Connection"
        else:
            mode = "Connect"
        pfdata = {
            "DisplayName": profile.DisplayName,
            "pfp": str(profile.pfp),
            "mode": mode
        }
        data[user.username] = pfdata
    return JsonResponse(data)






    


        
