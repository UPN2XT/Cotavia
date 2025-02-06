from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import Profile, ConnectionRequest, User
from .serializers import handleConnectionRequestSerializers

class RequestsHandler(APIView):
    permission_classes = [IsAuthenticated]

    def getTargetProfile(self, request, mode, username, userProfile):
        try:
            if mode == "i":
                return ConnectionRequest.objects.get(To=userProfile, From__user__username=username)
            elif mode=="o":
                return ConnectionRequest.objects.get(From=userProfile, To__user__username=username)
            elif mode=="c":
                return request.user.userprofile.get().connections.get(user__username=username)
            else:
                return User.objects.filter(username=username).first().userprofile.get()
        except:
            return None

    def handleRelation(self, request, mode, username, accept):
        userProfile: Profile = request.user.userprofile.get()
        target: Profile = self.getTargetProfile(request, mode, username, userProfile)
        if target == None:
            return Response("{error: 'target not found'}", status=status.HTTP_404_NOT_FOUND)
        if mode == "i" or mode=="o":
            if accept == 'T' and mode == "i":
                userProfile.connections.add(target.From)
            target.delete()
        elif mode == 'c':
            userProfile.connections.remove(target)
        else:
            ConnectionRequest.objects.create(To=target, From=userProfile)
        return Response({"message": "ok"})

    def post(self, request):

        serializer = handleConnectionRequestSerializers(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        mode: str = serializer.validated_data["mode"]
        username: str = serializer.validated_data["username"]
        accept: str = serializer.validated_data["accept"]
        return self.handleRelation(request, mode, username, accept)