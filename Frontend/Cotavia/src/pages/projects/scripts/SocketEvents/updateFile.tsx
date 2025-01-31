import FileSender from "../../../Link/scripts/FileSender";
import { Folder } from "../../components/DirectoryViewer";
import getFile from "../../../Link/scripts/getFile";
import { UpdateFile } from "../Updater";


export default function(setDictionary: Function, currentPath: string, setUpToDateData: Function, id: string, codeText: string,
    LiveUpdate: boolean, setLinkDirectory: Function, LiveSocket: WebSocket | null, data: {data: string, path: string, name: string}) {
        setDictionary((d: Folder) => UpdateFile(d, data))
        LiveUpdate && setLinkDirectory((d: Folder) => UpdateFile(d, data))
        if (typeof data["data"] == "string") data["data"] = JSON.parse(data["data"])
        if (data["path"] == currentPath && data["data"] != codeText)
            setUpToDateData(false)
        LiveUpdate && (() => {
            const path = data["path"] == ""? data["name"]: `${data["path"]}/${data["name"]}`
            getFile(path, id)
            .then(result => {
                if (result == null)
                    return
                FileSender(LiveSocket, result, path, id)
            })
        })()
            
}