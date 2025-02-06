from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated

@method_decorator(csrf_protect, name='dispatch')
class GetProjects(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        projectsList = {}
        projects = request.user.projectsin.all()
        for project in projects:
            projectsList[project.projectName] = str(project.id)
        return Response(projectsList, content_type="application/json")