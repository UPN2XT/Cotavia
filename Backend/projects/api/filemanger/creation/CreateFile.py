from ...serializers.filemangerSerializers import FileCreationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.creationFunctions import create_file
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from ...utils.common.messageProdcast import sendMessage
from ...utils.common.RolebasicInheritance import BasicInheritance

@method_decorator(csrf_protect, name='dispatch')
class CreateFile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FileCreationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
        id = serializer.validated_data["ID"]
        name = serializer.validated_data["name"]
        UUID = serializer.validated_data["UUID"]
        Type = serializer.validated_data["Type"]
        data = serializer.validated_data["data"]

        try:
            path = serializer.validated_data["path"]
        except:
            path = ""

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        ok, file = create_file(UUID, project, data, name, request.user, Type)

        if not ok:
            return Response({"error": file}, status=status.HTTP_403_FORBIDDEN)
        
        BasicInheritance(file)

        sendMessage( project, {  
            "event": "update/file",
            "path": path,
            "name": file.name,
            "data": {
                "version": file.version,
                "type": file.filetype,
                "UUID": str(file.UUID)
            },
            "pUUID": str(UUID)
        })
        
        return Response({"status": "ok"})

