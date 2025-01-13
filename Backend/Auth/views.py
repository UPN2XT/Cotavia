from .models import User
from django.http import HttpRequest, HttpResponseNotAllowed, HttpResponseBadRequest, HttpResponse, HttpResponseNotFound
from django.contrib.auth import authenticate, login, logout
from .forms import signupFrom, loginForm
from userConnections.models import Profile
import random
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from django.core.files.base import ContentFile

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


def Login(request: HttpRequest):
    if not request.method == 'POST':
        return HttpResponseNotAllowed()
    
    form = loginForm(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest()

    try:
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user=user)
            return HttpResponse()
        
        else:
            return HttpResponseNotFound()
        
    except:
            return HttpRequest("error")
    

def signup(request: HttpRequest):
    if not request.method == 'POST':
        return HttpResponseNotAllowed()

    form = signupFrom(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest()
    
    username = form.cleaned_data["username"]
    password = form.cleaned_data["password"]
    email = form.cleaned_data["email"]
    displayname: str = form.cleaned_data["displayname"]

    
    user = User.objects.filter(username=username,).first()
    if user is not None:
        return HttpResponseNotAllowed()

    user = User.objects.create_user(username=username, password=password, email=email)
    profile = Profile.objects.create(displayName=displayname, user=user)
    pfp = generate_letter_image(displayname[0])
    profile.pfp.save(f"{user.username}_profile.png", pfp)
    login(request, user=user)

    return HttpResponse()
        
    
    

def logoutit(request: HttpRequest):
    if not request.user.is_authenticated:
        return HttpResponseNotAllowed()
    logout(request)
    return HttpResponse()
        

