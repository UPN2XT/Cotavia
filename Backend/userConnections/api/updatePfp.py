from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import updatePfpSerializer
from ..models import Profile
from PIL import Image
import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.http import FileResponse

class UpdatePfp(APIView):

    def validate_image(self, image):
        try:
            img = Image.open(image)
            img.verify() 
            image.seek(0) 
            return True
        except:
            return False

    def process_image(self, uploaded_image):
        """Process the image to 256x256 with 1:1 aspect ratio."""
        img = Image.open(uploaded_image)
        
        # Convert to RGB if image has transparency (RGBA, LA)
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        width, height = img.size
        
        if width != height:
            # Add white borders to make it square
            size = max(width, height)
            new_img = Image.new('RGB', (size, size), (255, 255, 255))
            offset = ((size - width) // 2, (size - height) // 2)
            new_img.paste(img, offset)
            img = new_img
        
        # Resize to 256x256 using high-quality downsampling
        img = img.resize((256, 256), Image.LANCZOS)
        return img

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = updatePfpSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "now allowed"}, status=status.HTTP_400_BAD_REQUEST)

        pfp = serializer.validated_data["pfp"]
        if not self.validate_image(pfp):
            return Response({"error": "now allowed"}, status=status.HTTP_400_BAD_REQUEST)
        image = self.process_image(pfp)
        output = BytesIO()
        image.save(output, format='PNG')
        output.seek(0)

        profile: Profile = request.user.userprofile.get()
        profile.pfp.save(profile.pfp.name, ContentFile(output.getvalue()), save=True)

        return Response({"url": profile.pfp.url})