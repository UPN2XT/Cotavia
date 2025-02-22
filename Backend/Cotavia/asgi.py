"""
ASGI config for Cotavia project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import  django

django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from .routing import websocket_urlpatterns

settings_module = 'Cotavia.deploymentSettings' if 'WEBSITE_HOSTNAME' in os.environ else 'Cotavia.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

django_asgi_app = get_asgi_application()

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        "OPTIONS": {
            "expiration_secs": 500
        }
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

AZURE_ACCOUNT_NAME = os.getenv("AZURE_ACCOUNT_NAME", "default-secret-key")
AZURE_ACCOUNT_KEY = os.getenv("AZURE_ACCOUNT_KEY", "default-secret-key")
AZURE_CONTAINER = os.getenv("AZURE_CONTAINER", "default-secret-key")
AZURE_OVERWRITE_FILES = True

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": 
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    ,
})

'''os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Cotavia.settings')

application = get_asgi_application()'''
