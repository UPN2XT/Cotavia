import json
import os
from .functions import getProject, createProject, cut, copy, delete, init, getF
from .functions import open_terminal_in_new_window,upload, updatePaths, createDir, renameFile, renameFolder

basicData = {}

def setBasicData():
    with open("settings.json", "r") as f:
            global basicData
            basicData = json.load(f)



functions = {
    "getProject": getProject,
    "createProject": createProject,
    "cut": cut,
    "copy": copy,
    "delete": delete,
    "init-transfer": init,
    "load": upload,
    "updatePaths": updatePaths,
    "createDir": createDir,
    "open/terminal": open_terminal_in_new_window,
    "get/file": getF,
    "folder/rename": renameFolder,
    "file/rename": renameFile
}

async def handler(websocket):
    try:
        print("Connected")
        setBasicData()
        while True:
            message = await websocket.recv()
            message = json.loads(message)
            print(message["event"])
            try:
                answer = functions[message["event"]](message["data"], basicData)
                await websocket.send(answer)
            except:
                print("error")
    except:
         print("Connection ended")
            
    