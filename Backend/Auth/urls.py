from django.urls import path
from .views import Login, logoutit, signup, get_csrf_token

urlpatterns = [
    path("login", Login, name="login"),
    path("signup", signup, name="new Account"),
    path("logout", logoutit, name="logout"),
    path("get/token", get_csrf_token, name="get Csrf")
]