import { InfoMenu } from "../../../../context/projectContext";
import { Delete } from "../Updater";
import { Folder } from "../../components/DirectoryViewer";

export default function (
    setDictionary: Function, id: string, setTabs: Function, setLinkDirectory: Function, data: {path: string, pUUID:string},
        RoleMenu: InfoMenu, setRoleMenu: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean, type: string,
        currentPath: string, setDeletedFile: Function 
) {
    setDictionary((d: Folder) => Delete(d, data["path"], type == "folder"))
    LiveUpdate && setLinkDirectory((d: Folder) => Delete(d, data["path"], type == "folder"))
    setTabs((s: string[]) => s.filter(e => !e.startsWith(data["path"])))
    if (currentPath.startsWith(data["path"]))
        setDeletedFile(true)
    if (RoleMenu.path.startsWith(data["path"])) setRoleMenu((prev: InfoMenu) => ({
        ...prev,
        toggle: false
    }))
    LiveUpdate && LinkSocket?.send(JSON.stringify({
        event: "delete",
        data: {
            ID: id,
            type: type,
            path: data["path"]
        }
    }))
}