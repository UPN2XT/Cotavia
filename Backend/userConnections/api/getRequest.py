from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .utils import createProfileData
from ..models import Profile

class GetRequests(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reqsList = {}
        mode = request.POST.get("mode")
        if mode == None:
            return Response('{error: "invalid request"}', status=status.HTTP_400_BAD_REQUEST)
        my_profile = Profile.objects.get(user=request.user)
        if mode == 'i':
            reqs = Profile.objects.filter(outgoingrequest__To=my_profile)
        elif mode == 'o':
            reqs = Profile.objects.filter(incomingrequests__From=my_profile)
        else:
            reqs = request.user.userprofile.get().connections.all()
        for r in reqs:
            reqsList[str(r.user.username)] = createProfileData(r)
        return Response(reqsList)