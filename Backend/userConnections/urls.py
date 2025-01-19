from django.urls import path, include
from . import views

urlpatterns = [
    path("profiles/self", views.getUserProfile, name="getMyProfile"),
    path("profiles/reqs", views.getRequest, name="getRequests"),
    path("profiles/req/handle", views.handleConnectionRequest, name="handleReqs")
]