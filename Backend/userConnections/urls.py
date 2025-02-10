from django.urls import path, include
from . import views
from .api.getUserProfile import ProfileView
from .api.getRequest import GetRequests
from .api.search import Search
from .api.Handler import RequestsHandler
from .api.updateDisplayname import UpdateDisplayName
from .api.updatePfp import UpdatePfp

urlpatterns = [
    path("profiles/self", ProfileView.as_view(), name="getMyProfile"),
    path("profiles/reqs", GetRequests.as_view(), name="getRequests"),
    path("profiles/req/handle", RequestsHandler.as_view(), name="handleReqs"),
    path("profiles/search", Search.as_view(), name="user search"),
    path("profiles/update/pfp", UpdatePfp.as_view(), name="updatePfp"),
    path("profiles/update/displayname", UpdateDisplayName.as_view(), name="updateDisplayname")
]