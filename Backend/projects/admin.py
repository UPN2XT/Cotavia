from django.contrib import admin
from .models import File, Folder, Project
# Register your models here.

admin.site.register(File)
admin.site.register(Folder)
admin.site.register(Project)
