from ...serializers.filemangerSerializers import MoveSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ....models import Project
from ...utils.filemanger.CopyFunctions import copyFile, copyFolder
from ...utils.filemanger.moveFunction import cut_file, cut_folder
from ...utils.common.getProject import getProject, PROJECTNOTFOUND
from ...utils.common.messageProdcast import sendMessage

INVALIDREQUEST =  Response({"error": "invalid request"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_protect, name='dispatch')
class MoveF(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MoveSerializer(data=request.data)

        if not serializer.is_valid():
            return INVALIDREQUEST
        
        id = serializer.validated_data["ID"]
        UUIDFolder = serializer.validated_data["UUIDTo"]
        UUIDTarget = serializer.validated_data["UUIDFrom"]
        From = serializer.validated_data["From"]
        Type = serializer.validated_data["Type"]
        mode = serializer.validated_data["mode"]

        try:
            To = serializer.validated_data["To"]
        except:
            To = ""

        project: Project = getProject(id, request)

        if not project:
            return PROJECTNOTFOUND

        UUIDData = ""

        if mode == "copy":
            if Type == "folder":
                ok, target, UUIDData, pUUID, pUUID2 = copyFolder(UUIDFolder, UUIDTarget, project, request.user)
            elif Type == "file":
                ok, target, UUIDData, pUUID, pUUID2 = copyFile(UUIDFolder, UUIDTarget, project, request.user)
            else:
                return INVALIDREQUEST
        
        elif mode == 'cut':
            if Type == "folder":
                ok, target, pUUID, pUUID2 = cut_folder(UUIDTarget, UUIDFolder, project, request.user)
            elif Type == "file":
                ok, target, pUUID, pUUID2 = cut_file(UUIDTarget, UUIDFolder, project, request.user)
            else:
                INVALIDREQUEST
        else:
            return INVALIDREQUEST

        if not ok:
            return Response({"error": target}, status=status.HTTP_403_FORBIDDEN)
        
        
        sendMessage( project, {  
            "event": f"{mode}/{Type}",
            "from": From,
            "to": To,
            "name": target,
            "UUIDData": UUIDData,
            "pUUID": str(pUUID), 
            "pUUID2": str(pUUID2)
        })
        
        return Response({"status": "ok"})

