from ...serializers.filemangerSerializers import GetFileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.GetFunctions import get_file
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from django.http import FileResponse
from ...utils.common.FileCore import openFile

@method_decorator(csrf_protect, name='dispatch')
class GetFile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GetFileSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
        id = serializer.validated_data["ID"]
        UUID = serializer.validated_data["UUID"]

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        ok, target = get_file(UUID, project, request.user)

        if not ok:
            return Response({"error": target}, status=status.HTTP_403_FORBIDDEN)
        
        
        return FileResponse(openFile(target.data.name))

