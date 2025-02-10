from ...serializers.filemangerSerializers import folderCreationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.creationFunctions import create_folder
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from ...utils.common.messageProdcast import sendMessage
from ...utils.common.RolebasicInheritance import BasicInheritance

@method_decorator(csrf_protect, name='dispatch')
class CreateFolder(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = folderCreationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
        id = serializer.validated_data["ID"]
        name = serializer.validated_data["name"]
        UUID = serializer.validated_data["UUID"]

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        ok, folder = create_folder(UUID, project, name, request.user)

        if not ok:
            return Response({"error": folder}, status=status.HTTP_403_FORBIDDEN)
        
        BasicInheritance(folder)
        
        sendMessage( project, {  
            "event": "create/folder",
            "name": folder.name,
            "UUID": str(folder.UUID),
            "pUUID": str(UUID)
        })
        
        return Response({"status": "ok"})

