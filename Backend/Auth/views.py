from .models import CoreUser as User
from django.http import HttpRequest, HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
import json

# Create your views here.

def Login(request: HttpRequest):
    if not request.method == 'POST':
        return HttpResponseNotAllowed()

    try:
        username = request.POST.get("username")
        password = request.POST.get("password")

        if not username or not password:
            return HttpResponseBadRequest()
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user=user)
            return HttpResponse()
        
        else:
            return HttpResponseBadRequest()
        
    except:
            return HttpResponse()
    

def signup(request: HttpRequest):
    if not request.method == 'POST':
        return HttpResponseNotAllowed()

  
    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return HttpResponseBadRequest()
        
    user = User.objects.filter(username=username).first()

    if user is not None:
        return HttpResponseNotAllowed()

    user = User.objects.create_user(username=username, password=password)
    login(request, user=user)

    return HttpResponse()
        
    
    

def logoutit(request):
     logout(request)
     return HttpResponse()
        

