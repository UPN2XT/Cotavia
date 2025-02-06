from ..serializers.IDSerializer import IDSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ..utils.projectDocumentCreator import createDoc
from ..utils.common.getProject import getProject, PROJECTNOTFOUND

@method_decorator(csrf_protect, name='dispatch')
class GetProject(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        return Response(createDoc(project, request.user))