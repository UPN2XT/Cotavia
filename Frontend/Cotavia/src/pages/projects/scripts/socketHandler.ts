import { createFolder, UpdateFile, Delete, Move } from "./Updater"
import applicationData from "../../../data";
import { Folder } from "../components/DirectoryViewer";
import { InfoMenu } from "../../../context/projectContext";

const socketHandler = (setDictionary: Function, currentPath: string, setUpToDateData: Function, id: string, codeText: string, setTabs: Function,
    RoleMenu: InfoMenu, setRoleMenu: Function, permisonUpdateFunction: Function, nav: Function
) => {
        const socket = new WebSocket(`${applicationData.WsHost}ws/projects/update/${id}/`);
        socket.onopen = function(event) {
            console.log(event.timeStamp)
        };
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data)
            if (data["event"] == "delete/User") {
                nav("../")
                return
            }
            if (data["event"] == "role/change/reload") {
                permisonUpdateFunction()
                return
            }
            if (data["event"] == "create/folder") {
                setDictionary((d: Folder) => createFolder(d, data))
                return
            }
            if (data["event"] == "update/file")
            {
                setDictionary((d: Folder) => UpdateFile(d, data))
                if (data["path"] == currentPath && data["data"] != codeText)
                    setUpToDateData(data["data"])
                return
            }
            const parms = String(data["event"]).split("/")
            const isFolder = "folder" == parms[1]
            if (parms[0] == "delete") {
                setDictionary((d: Folder) => Delete(d, data["path"], isFolder))
                setTabs((s: string[]) => s.filter(e => e != data["path"]))
                if (RoleMenu.path == data["path"]) setRoleMenu((prev: InfoMenu) => ({
                    ...prev,
                    toggle: false
                }))
                return
            }
                
            setDictionary((d: Folder) => Move(d, data["from"],data["to"], isFolder, data["name"]))
            if (parms[0] == "cut")
            {
                if (parms[1] == 'file')
                    setTabs((s: string[]) => s.map(e => e == data["from"]? data["from"]: e))
                else
                setTabs((s: string[]) => s.map(e => {
                    if (!e.startsWith(data["from"]))
                        return e
                    return e.replace(data["from"], data["to"])
                }))
                setDictionary((d: Folder) => Delete(d, data["from"], isFolder))
                const x = data["from"].split("/")
                if (RoleMenu.path == data["from"]) setRoleMenu((prev: InfoMenu) => ({
                    ...prev,
                    path: data["to"]+"/"+x[x.length-1]
                }))
            } 
                
        }
    }

export default socketHandler