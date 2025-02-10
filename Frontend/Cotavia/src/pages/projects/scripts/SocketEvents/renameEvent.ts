import { InfoMenu, UUIDPATHS } from "../../../../context/projectContext";
import { rename } from "../Updater";
import { Folder } from "../../components/DirectoryViewer";

export default function (
    setDictionary: Function, id: string, setTabs: Function, setLinkDirectory: Function, data: any,
        RoleMenu: InfoMenu, setRoleMenu: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean, type: string,
        setUUIDList: Function
) {
    const x = String(data['path']).split('/').slice(0, -1)
    x.push(data['name'])
    const loc = x.join('/') + (data['Type'] == 'folder'? '/': '')
    setDictionary((d: Folder) => rename(d, data["path"], type == "folder", data['name']))
    LiveUpdate && setLinkDirectory((d: Folder) => rename(d, data["path"], type == "folder", data['name']))
    setTabs((s: string[]) => 
        s.map(e => {
            if (e.startsWith(data['path'])) {
                e.replace(data['path'], loc)
            }
            return e
        }))
    if (RoleMenu.path == data["path"]) setRoleMenu((prev: InfoMenu) => ({
        ...prev,
        toggle: false
    }))
    LiveUpdate && LinkSocket?.send(JSON.stringify({
        event: "rename",
        data: {
            ID: id,
            type: type,
            path: data["path"],
            name: data['name']
        }
    }))

    

    if (type=='folder')
        setUUIDList((prev: UUIDPATHS) => (
            {
                folders: {
                    ...prev.folders, 
                    [data['UUID']]: loc
                },
                files: {...prev.files}
        }))
    else
        setUUIDList((prev: UUIDPATHS) => (
        {
            folders: {
                ...prev.folders
            },
            files: {
                ...prev.files,
                [data['UUID']]: loc
            }
        })) 
}