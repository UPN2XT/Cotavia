from django.urls import path, include
from .views import views
from .views.ProjectSettings.roleSettings import getRoles, updateRole
from .views import projectAcess
from .views.Filemanger import dirmanage
from .views.ProjectSettings.usersUpdate import getUsers, getConnectionsOutside, AddUser, removeUser

urlpatterns = [
    path("projectDirectory", views.createDoc, name="createDirectory"),
    path("getProjects", projectAcess.getProjects, name="getProjects"),
    path("create", projectAcess.createProject, name="createProject"),
    path("create/folder", dirmanage.createFolderRequest, name="createFolder"),
    path("create/file", dirmanage.createFileRequest, name="createFile"),
    path("updateFile", dirmanage.updateFile, name="updateFile"),
    path("getProject", projectAcess.getProjectData, name="getProject"),
    path("settings/updateCore", views.UpdateProjectCoreSettings, name="updateProjectCore"),
    path("settings/roles/getRoles", getRoles, name="settings/getRoles"),
    path("settings/roles/updateRole", updateRole, name="modifyRoles"),
    path("settings/users/get/projectUsers", getUsers, name="getProjectUsers"),
    path("settings/users/get/connections", getConnectionsOutside, name="getConnectionUsers"),
    path("settings/users/add", AddUser, name="addConnectedUsers"),
    path("settings/users/remove", removeUser, name="removeUser"),
]