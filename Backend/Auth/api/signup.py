from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.http import HttpRequest
from .serializers import SignupSerializer  
from userConnections.models import Profile
from PIL import Image, ImageDraw, ImageFont
from django.core.files.base import ContentFile
import random
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

def generate_letter_image(letter: str) -> ContentFile:
    letter = letter.upper() if letter.isalpha() else "?"
    img_size = (256, 256)
    bg_color = tuple(random.randint(0, 255) for _ in range(3))
    image = Image.new("RGB", img_size, color=bg_color)
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 150)  # TODO: change path
    except IOError:
        font = ImageFont.load_default()
    text_size = draw.textsize(letter, font=font)
    text_position = ((img_size[0] - text_size[0]) // 2, (img_size[1] - text_size[1]) // 2)
    draw.text(text_position, letter, fill="white", font=font)
    byte_io = BytesIO()
    image.save(byte_io, "PNG")
    return ContentFile(byte_io.getvalue(), f"{letter}_profile.png")

class SignupView(APIView):

    def post(self, request: HttpRequest):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        email = serializer.validated_data["email"]
        displayname = serializer.validated_data["displayname"]

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username is already in use"}, status=status.HTTP_409_CONFLICT)

        # Create user
        user = User.objects.create_user(username=username, password=password, email=email)

        # Create profile
        profile = Profile.objects.create(displayName=displayname, user=user)

        # Generate profile picture
        pfp = generate_letter_image(displayname[0])
        profile.pfp.save(f"{user.username}_profile.png", pfp)

        # Log in the user
        login(request, user=user)

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
