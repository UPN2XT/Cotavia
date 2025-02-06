import os
from django.core.files.storage import default_storage
from django.conf import settings

def get_file_upload_path(instance):
    """Generates upload path: 'projects/project_<project_id>/<uuid>.<ext>'"""
    try:
        ext = os.path.splitext(instance.name)[1]  # Get file extension with dot
    except:
        ext = "bin"
    return f"projects/project_{instance.project.id}/{instance.parentFolder.UUID}/{instance.UUID}.{ext}"

def createFile(path: str, file, f):
    try:
        full_path = os.path.join(get_file_upload_path(f),settings.MEDIA_ROOT, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True) # TODO modification needed for azure

        with default_storage.open(path, "wb+") as target:
            for chunck in file.chunks():
                target.write(chunck)

        target.data.name = full_path
        target.save()
    
    except:
        return None
    
def Modify(file_path: str, file):
    try:
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True) # TODO modification needed for azure

        with default_storage.open(file_path, "wb+") as target:
            for chunck in file.chunks():
                target.write(chunck)

        return file_path
    
    except:
        return None
    
def openFile(path: str):
    if path == "":
        return None
    try:
        file = default_storage.open(path, 'rb')
    except:
        file = None
    return file


def delete_file(file_path):
    try:
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
            return True
        else:
            return False
    except Exception as e:
        print(f"An error occurred while deleting the file: {e}")
        return False
