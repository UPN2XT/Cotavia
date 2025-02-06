from ...serializers.SettingsSerializers import UserHandlerSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from userConnections.models import Profile, User
from ...utils.common.messageProdcast import sendMessage

@method_decorator(csrf_protect, name='dispatch')
class UserHandler(APIView):

    permission_classes = [IsAuthenticated]

    def AddUser(self, request, project, username):
        try:
            user: User = request.user.userprofile.get().connections.get(user__username=username).user
        except:
            return Response({"erorr": "User Not found"}, status=status.HTTP_400_BAD_REQUEST)
        if project.user.filter(username=user.username).exists():
            return Response({"erorr": "User Already Added"}, status=status.HTTP_400_BAD_REQUEST)
        project.user.add(user)
        project.defaultrole.users.add(user)
        return Response({"message": "sucess"})

    def removeUser(self, request, project, username):
        try:
            user = project.user.get(username=username)
        except:
            return Response({"erorr": "User Not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        project.user.remove(user)
        roles = project.projectroles.filter(users=user)
        for role in roles:
            role.users.remove(user)

        sendMessage(project, {
            "event": "delete/User",
            "username": username
        })

        return Response({"message": "sucess"})

    def post(self, request, mode):
        serializer = UserHandlerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        username: str = serializer.validated_data["username"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if mode == "add":
            return self.AddUser(request, project, username)

        elif mode == "remove":
            return self.removeUser(request, project, username)
        
        return Response({}, status=status.HTTP_404_NOT_FOUND)