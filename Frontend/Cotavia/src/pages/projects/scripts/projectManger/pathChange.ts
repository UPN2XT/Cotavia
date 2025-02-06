import { Folder, FileContainer } from "../../components/DirectoryViewer"
import { getFile } from "../Updater"

interface cache {
    [path: string]: {data: Blob | string, file: FileContainer}
}

export default async function(
    setCodeText: Function, currentPath: string, dictionary: Folder, setUpToDateData: Function,
    chache: cache, socket: WebSocket | null, id: string, UpdateFunction: Function,
    LinkDirectory: Folder | null) {

    if (currentPath == "") {
        setCodeText({
            data: "",
            type: "",
            uuid: ""
        })
    }
    const file = getFile(dictionary, currentPath)
    if (file != null) {
        if (chache[currentPath] != null) {
            setCodeText({data: chache[currentPath].data, type:chache[currentPath].file.type, UUID: chache[currentPath].file.UUID})
            setUpToDateData(chache[currentPath].file.version == file.version)
            return
        }

        if (socket != null && LinkDirectory != null) {
            const linkFile = getFile(LinkDirectory, currentPath)
            if (linkFile != null) {
                socket.send(JSON.stringify({
                    event: "get/file",
                    data: {
                        ID: id,
                        path: currentPath,
                        
                    }
                }))
                return
            }
        }
        
        UpdateFunction(file)
            
    }
}