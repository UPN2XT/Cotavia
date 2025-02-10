from ...serializers.filemangerSerializers import FileUpdateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.GetFunctions import get_file
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from django.core.files.base import ContentFile
from ...utils.common.messageProdcast import sendMessage

@method_decorator(csrf_protect, name='dispatch')
class UpdateFile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FileUpdateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
        id = serializer.validated_data["ID"]
        UUID = serializer.validated_data["UUID"]
        data = serializer.validated_data["data"]
        Type = serializer.validated_data["Type"]

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        ok, target = get_file(UUID, project, request.user)

        if not ok:
            return Response({"error": target}, status=status.HTTP_403_FORBIDDEN)
        
        target.data.save(target.data.name, data, save=True)
        target.version = target.version + 1
        target.save()

        sendMessage(project, {
            "event": "update/file",
            "data": {
                "version": target.version,
                "type": Type,
                "UUID": str(target.UUID)
            },
            "name": target.name,
            "pUUID": str(target.parentFolder.UUID)
        })

        return Response({"message": "sucess"})

