from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import User
from ..models import Profile

class Search(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        find = request.POST.get('query')
        if find == None:
            return Response('{error: "invalid request"}', status=status.HTTP_400_BAD_REQUEST)
        Users = User.objects.filter(
            username__contains=find).exclude(username=request.user.username)
        data = {}
        my_profile = request.user.userprofile.get()
        for user in Users:
            profile: Profile = user.userprofile.get()
            # check the relation between the searched profiles and request user profile
            if my_profile.connections.filter(user=user).exists():
                continue
            elif profile.outgoingrequest.filter(From__user=user).exists():
                continue
            elif profile.incomingrequests.filter(To__user=user).exists():
                continue

            pfdata = {
                "displayname": profile.displayName,
                "pfp": str(profile.pfp.url),
            }
            data[user.username] = pfdata
        return Response(data)