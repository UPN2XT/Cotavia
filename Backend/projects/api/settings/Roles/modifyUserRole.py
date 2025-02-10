from ...serializers.SettingsSerializers import EditUsersInRoleSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from  ...utils.common.allowedAcess import modifyAllowed
from ...utils.common.messageProdcast import sendMessage

@method_decorator(csrf_protect, name='dispatch')
class EditUsersRole(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EditUsersInRoleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]
        name = serializer.validated_data["name"]
        username = serializer.validated_data["username"]
        action = serializer.validated_data["action"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        
        if not modifyAllowed(request.user, project):
            return Response({"error": "RD"}, status=status.HTTP_403_FORBIDDEN)
        
        role = project.projectroles.get(roleName=name)
        if action == "remove":
            user = role.users.filter(username=username).first()
            if user == None:
                return Response({"error": 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
            role.users.remove(user)
        elif action == "add":
            user = project.user.filter(username=username).first()
            if user == None:
                return Response({"error": 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
            role.users.add(user)
        else:
            Response({"error": 'Action not valid'}, status=status.HTTP_400_BAD_REQUEST)
        
        sendMessage(project, {
             "event": "role/change/reload"
        })

        return Response({"message": "ok"})
            