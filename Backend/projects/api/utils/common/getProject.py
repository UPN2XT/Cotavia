from ....models import Project
from rest_framework.response import Response
from rest_framework import status

PROJECTNOTFOUND = Response({"error": "project not found"}, status=status.HTTP_404_NOT_FOUND)

def getProject(id, request): 
    try:
        project: Project = request.user.projectsin.filter(id = id).first()
    except:
        project = None
    return project