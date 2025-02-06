from ...serializers.SettingsSerializers import switchVisbilitySerializer
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
class SwitchVisiblity(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = switchVisbilitySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        Type: str = serializer.validated_data["Type"]
        UUID = serializer.validated_data["UUID"]
        path = serializer.validated_data["path"]
        action = serializer.validated_data["action"]

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
        
        if action=="T":
            if target.allowedRoles.count() == 0 or not target.allowedRoles.filter(users=request.user):
                adminRole = project.projectroles.filter(users=request.user, isAdmin=True).first()
                target.allowedRoles.add(adminRole)
            target.limitedVisibility = True
            target.save()
            if Type == "folder":
                roles = target.allowedRoles.all().values_list("roleName", flat=True)
                RolePropgate(target, [], target.parentRoles.exclude(roleName__in=roles), True, True)
           
        else:
            target.limitedVisibility = False
            target.save()
            if Type == "folder":
                roles = target.allowedRoles.all().values_list("roleName", flat=True)
                RolePropgate(target, target.parentRoles.exclude(roleName__in=roles), [],True, True)
        
        sendMessage(project, {
            "event": f"role/change",
            "path": path,
            "Type": Type,
            "UUID": str(UUID)
        })

        return Response({
            "status": "ok"
        })
