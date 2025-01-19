from django.urls import path, re_path
from .consumers import ProjectConsumer

urlpatterns = [
    re_path(r'ws/projects/update/(?P<project_id>\d+)/$', ProjectConsumer.as_asgi(), name="wsi/projectUpdate")
]