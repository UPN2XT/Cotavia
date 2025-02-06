from ...serializers.SettingsSerializers import FolderRolesAcessSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from userConnections.models import Profile, User
from ...utils.filemanger.GetFunctions import get_file, get_folder

@method_decorator(csrf_protect, name='dispatch')
class GetRolesDir(APIView):

    permission_classes = [IsAuthenticated]

    def createUserList(self, users):
        data = {}
        for user in users:
            profile: Profile = user.userprofile.get()
            data[user.username] = {
                "displayname": profile.displayName,
                "pfp": profile.pfp.url
            }
        return data

    def post(self, request):
        serializer = FolderRolesAcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        Type: str = serializer.validated_data["Type"]
        UUID = serializer.validated_data["UUID"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if Type == "folder":
            ok, target = get_folder(UUID, project, request.user)
        elif Type == "file":
            ok, target = get_file(UUID, project, request.user)
        else: 
            return Response("{error: 'wrong type'}", status=status.HTTP_400_BAD_REQUEST)
        
        if not ok:
            return Response({"error": target}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        accessRoleName = ""
        
        try:
            if target.limitedVisibility == True:
                accessRoleName = target.allowedRoles.filter(users=request.user, isAdmin=True).first().roleName
        except:
                return Response({"error": "UA"}, status=status.HTTP_401_UNAUTHORIZED)
        
        rolesIn = target.allowedRoles.exclude(roleName=accessRoleName)
        rolesOut = target.parentRoles.exclude(roleName__in=rolesIn.values_list("roleName", flat=True)).exclude(roleName=accessRoleName)
        
        In = []
        for role in rolesIn:
            In.append(role.roleName)
        Out = []
        for role in rolesOut:
            Out.append(role.roleName)

        return Response({
            "limited": target.limitedVisibility,
            "rolesIn": In,
            "rolesOut": Out
        })
