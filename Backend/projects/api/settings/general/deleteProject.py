from ...serializers.IDSerializer import IDSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...utils.common.getProject import getProject, PROJECTNOTFOUND

@method_decorator(csrf_protect, name='dispatch')
class DeleteProject(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]

        project = getProject(id, request)

        if project == None:
            return PROJECTNOTFOUND
        
        if not project.creatorole.users.filter(username=request.user.username).exists():
            return Response({"error": "Only creator can change this settings"}, status=status.HTTP_403_FORBIDDEN)
        
        project.delete()

        return Response()