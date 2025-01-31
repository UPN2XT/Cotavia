import os
from django.core.files.storage import default_storage
from django.conf import settings

def createFilePath(project_ID, path, File_name):
    return os.path.join("files", "projectFiles", f"project_{project_ID}", path,File_name)

def createFile(path: str, file, ID, File_name):
    try:
        file_path = createFilePath(ID, path, File_name)
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True) # TODO modification needed for azure

        with default_storage.open(file_path, "wb+") as target:
            for chunck in file.chunks():
                target.write(chunck)

        return file_path
    
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
