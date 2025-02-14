import json
import os
from .filemanger import FileManager
import base64
import subprocess
import sys
import shlex
import base64

files = {}


def getPath(baicData, path, id):
    path = os.path.join(baicData["projects"][id]["location"], path)
    return path

def updatePaths(data, basicData):
    id = str(data['ID'])
    basicData["projects"][id]["paths"] = data["paths"]
    updateBasicData(basicData)
    return json.dumps({"messages": "sucess"})

def updateBasicData(data):
    with open("settings.json", "w") as f:
        json.dump(data, f)

def getProject(data, basicData):
    try:
        project = basicData["projects"][str(data["ID"])]
    except:
        project = None
    return json.dumps({"event": "projectResult", "project": project})

def createDir(data, basicData):
    path = getPath(basicData, data["path"], data["ID"])
    FileManager.make_dir(path)
    return json.dumps({
        "status": "sucess"
    })

def renameFolder(data, basicData):
    path = getPath(basicData, data["path"], data["ID"])
    FileManager.rename_folder(path, data["name"])
    return json.dumps({
        "status": "sucess"
    })

def renameFile(data, basicData):
    path = getPath(basicData, data["path"], data["ID"])
    FileManager.rename_file(path, data["name"])
    return json.dumps({
        "status": "sucess"
    })

def createProject(data, basicData):
    loc = os.path.join(basicData["directory"], f'{data["name"]}_{data["ID"]}')
    FileManager.make_dir(loc)
    basicData["projects"][str(data["ID"])] = {
        "name": data["name"],
        "location": loc,
        "paths": {"name": data["name"], "folders": {}, "files": {}}
    }
    updateBasicData(basicData)
    return json.dumps({"event": "projectCreation", "project": basicData["projects"][data["ID"]]})

def cut(data, basicData):
    id = data["ID"]
    if data["type"] == "folder":
        FileManager.cut_folder(getPath(basicData, data["src"], id), getPath(basicData, data["dest"], id))
    else:
        FileManager.cut_file(getPath(basicData, data["src"], id), getPath(basicData, data["dest"], id))
    return json.dumps({"status": "success"})

def copy(data, basicData):
    id = data["ID"]
    if data["type"] == "folder":
        FileManager.copy_folder(getPath(basicData, data["src"], id), getPath(basicData, data["dest"], id))
    else:
        FileManager.copy_file(getPath(basicData, data["src"], id), getPath(basicData, data["dest"], id))
    return json.dumps({"status": "success"})

def delete(data, basicData):
    id = data["ID"]
    if data["type"] == "folder":
        FileManager.delete_folder(getPath(basicData, data["path"], id))
    else:
        FileManager.delete_file(getPath(basicData, data["path"], id))
    return json.dumps({"status": "success"})

def init(data, basicData):
    id = data["ID"]
    path = getPath(basicData, data["path"], id)
    try:
        t = files[path]
    except:
        t = None
    if not t:
        files[path] = {
            "totalChunks": data["totalChunks"],
            "data": [],
            "index": 0
        }
    else:
        files[path]["totalChunks"] = data["totalChunks"]
    return json.dumps({"status": "success", "event": "tansferInitiated"})

def upload(data, basicData):
    id = data["ID"]
    path = getPath(basicData, data["path"], id)
    try:
        files[path]
    except:
        files[path] = {
            "totalChunks": 1000000,
            "data": [],
            "index": 0
        }
    path = getPath(basicData, data["path"], id)
    files[path]["data"].append(base64.b64decode(data["data"]))
    files[path]["index"] += 1
    if files[path]["index"] == files[path]["totalChunks"]:
        FileManager.create_file(path, b"".join(files[path]["data"]))
        del files[path]
    return json.dumps({"status": "success"})


def open_terminal_in_new_window(data, basicData):
    path = getPath(basicData, data["path"], data["ID"])
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
    return json.dumps({"status": "success"})
    
def getF(data, basicData):
    path = getPath(basicData, data["path"], data["ID"])
    file = FileManager.read_file(path)
    if file == None:
        return json.dumps({"event": "get/file", "status": "fail"})
    return json.dumps({
        "event": "get/file",
        "status": "success",
        "data": base64.b64encode(file).decode("utf-8")
    })


