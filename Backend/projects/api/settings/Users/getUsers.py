from ...serializers.IDSerializer import IDSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from userConnections.models import Profile, User

@method_decorator(csrf_protect, name='dispatch')
class GetUsers(APIView):

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

    def post(self, request, mode):
        serializer = IDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if mode == "projectUsers":
            users = project.user.exclude(username=request.user.username)

        elif mode == "connections":
            userProfile: Profile = request.user.userprofile.get()
            connectedUsers = User.objects.filter(userprofile__connections=userProfile)
            users = connectedUsers.exclude(id__in=project.user.all())
        
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(self.createUserList(users))