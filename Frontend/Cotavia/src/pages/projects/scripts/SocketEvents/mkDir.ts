import { UUIDPATHS } from "../../../../context/projectContext";
import { Folder } from "../../components/DirectoryViewer";
import { createFolder } from "../Updater";

export default function(setDictionary: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean,
    setLinkDirectory: Function, data: any, id: string, setUUIDList: Function) {
        setDictionary((d: Folder) => createFolder(d, data))
            LiveUpdate && setLinkDirectory((d: Folder) => createFolder(d, data))
            LiveUpdate && LinkSocket?.send(JSON.stringify({
                event: "createDir",
                data: {
                    ID: id,
                    path: data['path']
                }
        }))
        setUUIDList((prev: UUIDPATHS) => (
            {
                folders: {
                    ...prev.folders, 
                    [data['UUID']]: `${data['path']}${data['name']}/`
                },
                files: {...prev.files}
        }))
}