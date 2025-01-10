from django.shortcuts import render
from django.http import HttpResponse, HttpRequest


# Create your views here.

def index(request):
    return render(request, "index.html")

def test(request: HttpRequest):
    if request.user is not None:
        return HttpResponse("Hello " + request.user.username)
    return HttpResponse("not logged in")
