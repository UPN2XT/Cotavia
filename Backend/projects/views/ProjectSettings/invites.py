from django.http import HttpRequest, HttpResponseForbidden, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from ...forms.ProjectSettings.userSettingsForms import GetUsersForm
from ..utils.basicCheck import basicCheck
from ...models import Project, InviteToken, Role
from random import randint
from django.shortcuts import redirect

def createLinkInvite(request: HttpRequest):
    if not basicCheck(request):
        return HttpResponseForbidden()
    form = GetUsersForm(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest()
    id = form.cleaned_data["ID"]
    project: Project = request.user.projectsin.filter(id = id).first()
    if project == None:
        return HttpResponseNotFound()
    if not Role.objects.filter(project=project, users=request.user, isAdmin=True).exists():
        return HttpResponseForbidden()
    number = randint(0, 2**64)
    token:InviteToken = InviteToken.objects.create(From=request.user, number=number, project=project)
    return JsonResponse({
        "tokenId": token.number
    })

def acceptLinkInvite(request: HttpRequest, tokenId):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    token:InviteToken = InviteToken.objects.filter(number=tokenId).first()
    if token == None:
        return HttpResponseNotFound()
    token.project.user.add(request.user)
    token.delete()
    return redirect("/frontend/")

    