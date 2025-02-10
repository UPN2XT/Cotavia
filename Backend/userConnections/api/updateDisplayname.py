from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import updateDisplayNameSerializer
from ..models import Profile

class UpdateDisplayName(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = updateDisplayNameSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "now allowed"}, status=status.HTTP_400_BAD_REQUEST)

        name = serializer.validated_data["name"]

        profile: Profile = request.user.userprofile.get()
        profile.displayName = name
        profile.save()

        return Response({"status": "ok"})