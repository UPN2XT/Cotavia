from django.http import HttpRequest
from django.forms import forms
from django.http import HttpResponseBadRequest, HttpResponseForbidden, HttpResponse
from projects.models import Project, Role
import json

PROJECTNOTFOUNDERROR = HttpResponseBadRequest(json.dumps(
            {"error": "no linked projects with this id was found"}
        ))
ROLEDENIEDERROR = HttpResponseBadRequest(json.dumps(
            {"error": "Roles access Denied"}
        ))
SucessMessage = HttpResponse("{message: 'sucess'}")

def basicCheck(request: HttpRequest, method):
    if not request.user.is_authenticated:
        return False
    if request.method != method:
        return False
    return True

def requestCheck(request: HttpRequest, Form: forms.Form, values: list[str]):
    analsis = {"error": False}
    if not basicCheck(request, "POST"):
        analsis["error"] = True
        analsis["errorResponse"] = HttpResponseForbidden()
        return analsis
    form = Form(request.POST)
    if not form.is_valid():
        analsis["error"] = True
        analsis["errorResponse"] = HttpResponseBadRequest()
        return analsis
    for val in values:
        analsis[val] = form.cleaned_data[val]
    return analsis

def getProject(id, request: HttpRequest): 
    try:
        project: Project = request.user.projectsin.filter(id = id).first()
    except:
        project = None
    return project

def modificationAllowed(request, project):
    return Role.objects.filter(project=project, users=request.user, isAdmin=True).exists()