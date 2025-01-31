from django.apps import AppConfig
from django.middleware.csrf import get_token
from django.http import JsonResponse

class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Auth'

