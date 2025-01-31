from django.urls import path, include
from .views import views
from .views.ProjectSettings.roleSettings import getRoles, updateRole, getUserRelatedRoles, handleUserInRole, getRoleRelatedToDir, editRoleRelationWithDir, editVisiblity
from .views import projectAcess
from .views.Filemanger import dirmanage, ModifyMange
from .views.ProjectSettings.usersUpdate import getUsers, getConnectionsOutside, AddUser, removeUser

urlpatterns = [
    path("get/file", dirmanage.getFileRequest, name="getFile"),
    path("projectDirectory", views.createDoc, name="createDirectory"),
    path("getProjects", projectAcess.getProjects, name="getProjects"),
    path("permisions", projectAcess.getPermisionInfo, name="permisions"),
    path("create", projectAcess.createProject, name="createProject"),
    path("create/folder", dirmanage.createFolderRequest, name="createFolder"),
    path("create/file", dirmanage.createFileRequest, name="createFile"),
    path("filemanger/copy", ModifyMange.Copy, name="project/copy"),
    path("filemanger/cut", ModifyMange.Move, name="project/cut"),
    path("filemanger/delete", ModifyMange.Delete, name="project/delete"),
    path("updateFile", dirmanage.updateFile, name="updateFile"),
    path("getProject", projectAcess.getProjectData, name="getProject"),
    path("settings/updateCore", views.UpdateProjectCoreSettings, name="updateProjectCore"),
    path("settings/roles/getRoles", getRoles, name="settings/getRoles"),
    path("settings/roles/updateRole", updateRole, name="modifyRoles"),
    path("settings/roles/users/get", getUserRelatedRoles, name="usersInRole"),
    path("settings/roles/users/handle", handleUserInRole, name="handleUserInRole"),
    path("settings/users/get/projectUsers", getUsers, name="getProjectUsers"),
    path("settings/users/get/connections", getConnectionsOutside, name="getConnectionUsers"),
    path("settings/users/add", AddUser, name="addConnectedUsers"),
    path("settings/users/remove", removeUser, name="removeUser"),
    path("roles/dir/get", getRoleRelatedToDir, name="relatedRoles"),
    path("roles/dir/update", editRoleRelationWithDir, name="dir/role/update"),
    path("roles/dir/visiblity", editVisiblity, name="changeVisiblity")
]