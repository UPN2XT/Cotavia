import { InfoMenu } from "../../../../context/projectContext";
import { Delete } from "../Updater";
import { Folder } from "../../components/DirectoryViewer";

export default function (
    setDictionary: Function, id: string, setTabs: Function, setLinkDirectory: Function, data: {path: string},
        RoleMenu: InfoMenu, setRoleMenu: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean, type: string
) {
    setDictionary((d: Folder) => Delete(d, data["path"], type == "folder"))
    LiveUpdate && setLinkDirectory((d: Folder) => Delete(d, data["path"], type == "folder"))
    setTabs((s: string[]) => s.filter(e => e != data["path"]))
    if (RoleMenu.path == data["path"]) setRoleMenu((prev: InfoMenu) => ({
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