from ..serializers.IDSerializer import IDSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ..utils.common.getProject import getProject, PROJECTNOTFOUND

@method_decorator(csrf_protect, name='dispatch')
class GetPermisionInfo(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        id: str = serializer.validated_data["ID"]

        project = getProject(id, request)
        if project == None:
            return PROJECTNOTFOUND
        user = request.user
        admin : bool = project.projectroles.filter(isAdmin=True, users=user).exists()

        return Response({
            'isAdmin': admin,
            'canCreate': admin or project.projectroles.filter(canCreate=True, users=user).exists(),
            'canDelete': admin or project.projectroles.filter(canDelete=True, users=user).exists(),
            'canModifyFiles': admin or project.projectroles.filter(canModifyFiles=True, users=user).exists()
        })