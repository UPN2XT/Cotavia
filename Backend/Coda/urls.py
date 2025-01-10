from django.urls import path, re_path
from .views import index, test

urlpatterns = [
    re_path(r".*", index)
]