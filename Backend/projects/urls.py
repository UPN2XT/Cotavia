from django.urls import path
from .api.project.createNewProject import CreateProject
from .api.project.getPermisionInfo import GetPermisionInfo
from .api.project.getProjects import GetProjects
from .api.project.getProject import GetProject
from .api.filemanger.creation.CreateFolder import CreateFolder
from .api.filemanger.deletion.Delete import DeleteF
from .api.filemanger.creation.CreateFile import CreateFile
from .api.filemanger.Files import GetFile, UpdateFile
from .api.settings.Users.getUsers import GetUsers
from .api.settings.Users.UsersHandler import UserHandler
from .api.settings.DirRoles.GetRoles import GetRolesDir
from .api.filemanger.move.Move import MoveF
from .api.settings.Roles.GetRoles import GetRoles
from .api.settings.Roles.EditRoles import EditRole
from .api.settings.Roles.GetUserRoles import GetUsersRole
from .api.settings.Roles.modifyUserRole import EditUsersRole
from .api.settings.DirRoles.SwitchVisiblity import SwitchVisiblity
from .api.settings.DirRoles.EditRelatedRoles import EditRolesDir
from .api.project.leaveProject import LeaveProject
from .api.settings.general.getProjectInfo import GetProjectGeneral
from .api.settings.general.ChangeProjectName import ChangeProjectName
from .api.settings.general.deleteProject import DeleteProject
from .api.settings.general.setProjectCreatoruser import ChangeCreatorUser
from .api.filemanger.rename.Rename import RenameF

urlpatterns = [
    path("get/file", GetFile.GetFile.as_view(), name="getFile"),
    path("leave", LeaveProject.as_view(), name="leaveProject"),
    path("getProject", GetProject.as_view(), name="getProject"),
    path("getProjects", GetProjects.as_view(), name="getProjects"),
    path("permisions",GetPermisionInfo.as_view(), name="permisions"),
    path("create", CreateProject.as_view(), name="createProject"),
    path("create/folder", CreateFolder.as_view(), name="createFolder"),
    path("create/file", CreateFile.as_view(), name="createFile"),
    path("filemanger/move", MoveF.as_view(), name="project/copy"),
    path("filemanger/delete", DeleteF.as_view(), name="project/delete"),
    path('filemanger/rename', RenameF.as_view(), name='RenameFile'),
    path("updateFile", UpdateFile.UpdateFile.as_view(), name="updateFile"),
    path("settings/roles/getRoles", GetRoles.as_view(), name="settings/getRoles"),
    path("settings/roles/updateRole", EditRole.as_view(), name="modifyRoles"),
    path("settings/roles/users/get", GetUsersRole.as_view(), name="usersInRole"),
    path("settings/roles/users/handle", EditUsersRole.as_view(), name="handleUserInRole"),
    path("settings/users/get/<str:mode>", GetUsers.as_view(), name="getProjectUsers"),
    path("settings/users/<str:mode>", UserHandler.as_view(), name="addConnectedUsers"),
    path("roles/dir/get", GetRolesDir.as_view(), name="relatedRoles"),
    path("roles/dir/update", EditRolesDir.as_view(), name="dir/role/update"),
    path("roles/dir/visiblity", SwitchVisiblity.as_view(), name="changeVisiblity"),
    path("settings/get/generalinfo", GetProjectGeneral.as_view(), name="getProjectData"),
    path("settings/set/name", ChangeProjectName.as_view(), name="setProjectName"),
    path("settings/change/creator", ChangeCreatorUser.as_view(), name="changeProjectCreator"),
    path("settings/delete", DeleteProject.as_view(), name="deleteProject")
]