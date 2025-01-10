from django.urls import path
from .views import Login, logoutit, signup

urlpatterns = [
    path("login", Login, name="login"),
    path("signup", signup, name="new Account"),
    path("logout", logoutit, name="logout")
]