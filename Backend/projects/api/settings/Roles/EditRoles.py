from ...serializers.SettingsSerializers import RoleUpdateHandlerSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from ...utils.common.allowedAcess import modifyAllowed
from ...utils.common.messageProdcast import sendMessage
from ....models import Role
from ...utils.common.RolePropgation import RolePropgate

@method_decorator(csrf_protect, name='dispatch')
class EditRole(APIView):

    permission_classes = [IsAuthenticated]

    def reloadEvent(self, project):
        sendMessage(project, {
            "event": "role/change/reload"
        })

    def deleteRole(self, role: Role, project): 
        role.delete()
        self.reloadEvent(project)
        return Response({"message": "ok"})


    def updateRoleInfo(self, role: Role, data, project):
        role.isAdmin = data["isAdmin"]
        role.canCreate = data["canCreate"]
        role.canDelete = data["canDelete"]
        role.canModifyFiles = data["canModifyFiles"]
        role.save()
        self.reloadEvent(project)
        return Response({"message": "ok"})

    def createNewRole(self, data, project):
        if project.projectroles.filter(roleName=data["name"]).exists():
            return Response({"error": "role already exits"}, status=status.HTTP_400_BAD_REQUEST)
        role: Role = Role(
            isAdmin=data["isAdmin"], canCreate=data["canCreate"],
            canDelete=data["canDelete"], canModifyFiles=data["canModifyFiles"],
            roleName=data["name"], project=project)
        role.save()
        RolePropgate(project.rootFolder, [role], [], True)
        self.reloadEvent(project)
        return Response({"message": "ok"})

    def actionHandler(self, action, data, project):
        if action == "create":
            return self.createNewRole(data, project)
        try:
            role: Role = project.projectroles.get(roleName=data["name"])
        except:
            return Response({"error": "role not found"}, status=status.HTTP_400_BAD_REQUEST)
        if role == project.creatorole:
            return Response({"error": "Trying to delete alter the cretor role"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        if action == "update":
            return self.updateRoleInfo(role, data, project)
        if action == "delete":
            if project.defaultrole == role:
                return Response({"error": "Trying to delete default role"}, 
                                    status=status.HTTP_400_BAD_REQUEST)
            return self.deleteRole(role, project)
        return Response({"error": "action not valid"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = RoleUpdateHandlerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        action: str = serializer.validated_data["action"]
        data: str = serializer.validated_data["data"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if not modifyAllowed(request.user, project):
            return Response({"error": "RD"}, status=status.HTTP_403_FORBIDDEN)
        
        return self.actionHandler(action, data, project)
            