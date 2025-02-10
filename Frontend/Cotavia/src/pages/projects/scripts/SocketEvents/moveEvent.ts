import { InfoMenu, UUIDPATHS } from "../../../../context/projectContext";
import { Move, Delete } from "../Updater";
import { Folder } from "../../components/DirectoryViewer";

export default function (
    setDictionary: Function, id: string, setTabs: Function,
        RoleMenu: InfoMenu, setRoleMenu: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean,
        setLinkDirectory: Function, parms: string[], data: any, setUUIDFunction: Function
) {
    let key = ''
    const u = String(data["from"]).split("/")
    LiveUpdate && LinkSocket?.send(JSON.stringify({
        event: parms[0] == "cut"? "cut": "copy",
        data: {
            ID: id,
            type: parms[1],
            src: data["from"],
            dest: parms[1] == "file"? data["to"]: data["to"] + "/" + u[u.length - 1]
        }
    }))    
    const isCopy = parms[0] == "copy"
    
    setDictionary((d: Folder) => Move(d, data["from"],data["to"], parms[1] == "folder", data["name"], data["UUIDData"], isCopy))
    LiveUpdate && setLinkDirectory((d: Folder) => Move(d, data["from"],data["to"], parms[1] == "folder", data["name"], data["UUIDData"], isCopy))
    if (parms[0] == "cut") {
        if (parms[1] == 'file')
            setTabs((s: string[]) => s.map(e => e == data["from"]? data["from"]: e))
        else
            setTabs((s: string[]) => s.map(e => {
                if (!e.startsWith(data["from"]))
                    return e
                return e.replace(data["from"], data["to"])
            }))
        setDictionary((d: Folder) => Delete(d, data["from"], parms[1] == "folder"))
        LiveUpdate && setLinkDirectory((d: Folder) => Delete(d, data["from"], parms[1] == "folder"))
        const x = data["from"].split("/")
        if (RoleMenu.path == data["from"]) setRoleMenu((prev: InfoMenu) => ({
            ...prev,
            path: data["to"]+"/"+x[x.length-1]
        }))
        key = data['pUUID2']
    } 

    const loc = `${data['to']}${data['name']}${parms[1]=='folder'? '/': ''}`    

    if (isCopy)
        if (parms[1] == 'file')
            key = data['UUIDData']
        else
            key = data['UUIDData'][data['pUUID2']]

    if  (parms[1] == 'file')
        setUUIDFunction((prev: UUIDPATHS) => (
        {
                folders: {
                    ...prev.folders, 
                },
                files: {
                    ...prev.files,
                    [key]: loc
                }
        }))
    else
        setUUIDFunction((prev: UUIDPATHS) => (
            {
                    folders: {
                        ...prev.folders, 
                        [key]: loc
                    },
                    files: {
                        ...prev.files,
                    }
            }))
}