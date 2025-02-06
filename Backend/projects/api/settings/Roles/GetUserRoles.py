from ...serializers.SettingsSerializers import GetUsersInRoleSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from userConnections.models import Profile

@method_decorator(csrf_protect, name='dispatch')
class GetUsersRole(APIView):

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
        serializer = GetUsersInRoleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        name = serializer.validated_data["name"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        role = project.projectroles.get(roleName=name)
        usersIn = role.users.all()
        usersOut = project.user.exclude(userRoles=role)
        return Response({
            "usersIn": self.createUserList(usersIn),
            "usersOut": self.createUserList(usersOut)
        })
            