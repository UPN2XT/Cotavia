from django.urls import path, include
from . import views

urlpatterns = [
    path("projectDirectory", views.createDoc, name="createDirectory"),
    path("getProjects", views.getProjects, name="getProjects"),
    path("create", views.createProject, name="createProject"),
    path("create/folder", views.createFolderRequest, name="createFolder"),
    path("create/file", views.createFileRequest, name="createFile"),
    path("updateFile", views.updateFile, name="updateFile"),
    path("getProject", views.getProject, name="getProject")
]