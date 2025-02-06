from django.contrib.auth import authenticate, login
from .serializers import LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

@method_decorator(csrf_protect, name='dispatch')
class Login(APIView):
    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            
            try:
                user = authenticate(request, username=username, password=password)
            except:
                user = None

            if user is not None:
                login(request, user=user)
                return Response('{message: "sucess"}', status=status.HTTP_200_OK)
            
            else:
                return Response('{error: "Username or password does not match"}', status=status.HTTP_406_NOT_ACCEPTABLE)
            
        except:
                return Response('{message: "sucess"}', status=status.HTTP_500_INTERNAL_SERVER_ERROR)