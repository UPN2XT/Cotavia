import subprocess
import os
import sys
import shlex

def open_terminal_in_new_window(path):
    folder = os.path.abspath(path)
    if os.path.isfile(folder):
        folder = os.path.dirname(folder)
    if sys.platform.startswith("win"):
        subprocess.run(f'start cmd /K cd /d "{folder}"', shell=True)
    elif sys.platform.startswith("linux"):
        safe_folder = shlex.quote(folder)
        subprocess.run(["gnome-terminal", "--working-directory", safe_folder])
    elif sys.platform.startswith("darwin"):
        script = f'tell application "Terminal" to do script "cd {shlex.quote(folder)}"'
        subprocess.run(["osascript", "-e", script])
    else:
        raise RuntimeError("Unsupported OS")

