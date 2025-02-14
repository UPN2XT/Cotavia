import os
import shutil

class FileManager:

    @staticmethod
    def make_dir(path):
        try:
            os.makedirs(path, exist_ok=True)
            print(f"Folder created: {path}")
        except Exception as e:
            print(f"Error creating folder: {e}")

    @staticmethod
    def delete_folder(path):
        try:
            shutil.rmtree(path)
            print(f"Folder deleted: {path}")
        except Exception as e:
            print(f"Error deleting folder: {e}")

    @staticmethod
    def cut_folder(src, dest):
        try:
            shutil.move(src, dest)
            print(f"Folder moved from {src} to {dest}")
        except Exception as e:
            print(f"Error moving folder: {e}")

    @staticmethod
    def copy_folder(src, dest):
        try:
            shutil.copytree(src, dest, dirs_exist_ok=True)
            print(f"Folder copied from {src} to {dest}")
        except Exception as e:
            print(f"Error copying folder: {e}")

    # 📄 File Operations
    @staticmethod
    def create_file(path, data):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        try:
            with open(path, "wb") as file:
                file.write(data)
            print(f"File created: {path}")
        except Exception as e:
            print(f"Error creating file: {e}")

    @staticmethod
    def delete_file(path):
        try:
            os.remove(path)
            print(f"File deleted: {path}")
        except Exception as e:
            print(f"Error deleting file: {e}")

    @staticmethod
    def cut_file(src, dest):
        try:
            shutil.move(src, dest)
            print(f"File moved from {src} to {dest}")
        except Exception as e:
            print(f"Error moving file: {e}")

    @staticmethod
    def copy_file(src, dest):
        try:
            shutil.copy2(src, dest)
            print(f"File copied from {src} to {dest}")
        except Exception as e:
            print(f"Error copying file: {e}")

    @staticmethod
    def read_file(path):
        try:
            with open(path, "rb") as f:
                return f.read()
        except:
            print("File could not be read")
            return None

    import os

    @staticmethod
    def rename_file(file_path, new_name):
        """Renames a file given its path and new name."""
        if not os.path.isfile(file_path):
            print('File not found')
            return
        
        directory = os.path.dirname(file_path)
        new_path = os.path.join(directory, new_name)

        os.rename(file_path, new_path)
        return new_path
    
    @staticmethod
    def rename_folder(folder_path, new_name):
        """Renames a folder given its path and new name."""
        if not os.path.isdir(folder_path):
            print('folder not found')
            return
        
        parent_dir = os.path.dirname(folder_path)
        new_path = os.path.join(parent_dir, new_name)

        os.rename(folder_path, new_path)
        return new_path

