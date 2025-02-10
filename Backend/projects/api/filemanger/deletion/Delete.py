from ...serializers.filemangerSerializers import DeletionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.GetFunctions import get_folder, get_file
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from ...utils.common.messageProdcast import sendMessage

@method_decorator(csrf_protect, name='dispatch')
class DeleteF(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeletionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
        id = serializer.validated_data["ID"]
        UUID = serializer.validated_data["UUID"]
        Type = serializer.validated_data["Type"]

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        if Type == "folder":
            ok, target = get_folder(UUID, project, request.user)
        elif Type == "file":
            ok, target = get_file(UUID, project, request.user)

        if not ok:
            return Response({"error": target}, status=status.HTTP_403_FORBIDDEN)
        
        target.delete()
        
        sendMessage( project, {  
            "event": f"delete/{Type}",
            "UUID": str(UUID)
        })
        
        return Response({"status": "ok"})

