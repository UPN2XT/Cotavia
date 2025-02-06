from ..serializers.ProjectAcessSerializers import createProjectSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from ...models import Folder, Role, Project
from ..utils.projectDocumentCreator import createDoc

@method_decorator(csrf_protect, name='dispatch')
class CreateProject(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = createProjectSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        name: str = serializer.validated_data["name"]
        project = Project.objects.create(projectName=name)
        folder = Folder.objects.create(name=name, project=project) # root folder
        project.user.add(request.user)
        role1 = Role.objects.create(project=project, isAdmin=True, roleName="creator") # admin role
        role2 = Role.objects.create(project=project, isAdmin=False, roleName="default") # default role
        project.defaultrole = role2
        project.creatorole = role1
        project.rootFolder = folder
        project.save()
        role1.users.add(request.user)
        folder.parentRoles.add(role1)
        folder.parentRoles.add(role2)
        return Response(createDoc(project, request.user))