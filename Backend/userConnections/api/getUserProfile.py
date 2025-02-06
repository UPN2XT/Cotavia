from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Profile

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def create_profile_data(self, profile: Profile):
        return {
            "Displayname": profile.displayName,
            "pfp": profile.pfp.url if profile.pfp else None,
            "username": profile.user.username,
        }

    def post(self, request):
        
        return Response(self.create_profile_data(request.user.userprofile.all().first()))