from django.urls import path
from .views import logoutit, get_csrf_token
from .api.login import Login
from .api.signup import SignupView

urlpatterns = [
    path("login", Login.as_view(), name="login"),
    path("signup", SignupView.as_view(), name="new Account"),
    path("logout", logoutit, name="logout"),
    path("get/token", get_csrf_token, name="get Csrf")
]