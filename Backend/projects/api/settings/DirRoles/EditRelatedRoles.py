from ...serializers.SettingsSerializers import EditRolesDirSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from userConnections.models import Profile, User
from ...utils.filemanger.GetFunctions import get_file, get_folder
from ...utils.common.RolePropgation import RolePropgate
from ...utils.common.messageProdcast import sendMessage
from ...utils.common.allowedAcess import modifyAllowed

@method_decorator(csrf_protect, name='dispatch')
class EditRolesDir(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EditRolesDirSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        Type: str = serializer.validated_data["Type"]
        UUID = serializer.validated_data["UUID"]
        path = serializer.validated_data["path"]
        add = serializer.validated_data["add"]
        remove = serializer.validated_data["remove"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if Type == "folder":
            ok, target = get_folder(UUID, project, request.user)
        elif Type == "file":
            ok, target = get_file(UUID, project, request.user)
        else: 
            return Response({"error": 'wrong type'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not ok:
            return Response({"error": target}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if not modifyAllowed(request.user, project):
            return Response({"error": 'RA'}, status=status.HTTP_401_UNAUTHORIZED)
        
        addedRoles = target.parentRoles.filter(roleName__in=add)
        removedRoles = target.allowedRoles.filter(roleName__in=remove)
        target.allowedRoles.add(*addedRoles)
        target.allowedRoles.remove(*removedRoles)
        if Type == "folder":
            RolePropgate(target, addedRoles, removedRoles, True, True)
        
        sendMessage(project, {
            "event": f"role/change",
            "path": path,
            "Type": Type,
            "UUID": str(UUID)
        })

        return Response({
            "status": "ok"
        })
