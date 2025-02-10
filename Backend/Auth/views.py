from django.http import HttpRequest, HttpResponseNotAllowed, HttpResponse
from django.contrib.auth import logout
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
        

def logoutit(request: HttpRequest):
    if not request.user.is_authenticated:
        return HttpResponseNotAllowed()
    logout(request)
    return HttpResponse()

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})
        

