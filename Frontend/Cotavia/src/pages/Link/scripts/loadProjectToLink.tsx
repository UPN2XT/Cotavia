import { Folder, FileContainer } from "../../projects/components/DirectoryViewer";
import data from "../../../data";
import useCrf from "../../../hooks/useCrf";
import FileSender from "./FileSender";

export default function update(ref: Folder | null, linkDir: Folder | null, path: string = "", socket: WebSocket | null, id: string) {
    if (socket == null) return false
    if (ref == null && linkDir == null) return
    if (ref == null) {
        socket.send(JSON.stringify({
            event: "delete",
            type: "folder",
            path: path,
            ID: id
        }))
        return
    }
        
    if (linkDir == null)
    {
        socket.send(JSON.stringify({
            action: "createDir",
            path: path,
            ID: id
        }))
        
        linkDir = {
            "name": 'x',
            files: {},
            folders: {}
        }
    }
        
    
    if (ref.folders == null) ref.folders = {}
    if (linkDir.folders == null) linkDir.folders = {}
    let k1 = Object.keys(ref.folders)
    let k2 = Object.keys(linkDir.folders)
    let k = [...new Set([...k1, ...k2])]
    for (const key of k) {
        update(ref.folders[key], linkDir.folders[key], path != ""?(path + "/" + key): key, socket, id)
    }
    if (ref.files == null) ref.files = {}
    if (linkDir.files == null) linkDir.files = {}
    k1 = Object.keys(ref.files)
    k2 = Object.keys(linkDir.files)
    k = [...new Set([...k1, ...k2])]
    for (const key of k) 
        updateFile(ref.files[key], linkDir.files[key], socket, path, id, key)
    

}

const updateFile = (fr: FileContainer, f2: FileContainer, socket: WebSocket, path:string, id: string, key: string) => {
    const p = (path == "")? key: path+"/"+key
    if (fr == null && f2 == null) return
    if (fr == null) {
        socket.send(JSON.stringify({
            event: "delete",
            ID: id,
            path: p,
            type: "file"
        }))
        return
    }
    if (f2 == null || f2.version != fr.version)
    {
        const body = useCrf()
        body.append("ID", id)
        body.append("path", p)
        fetch(data.host+"projects/get/file", {method: "POST", body: body})
        .then(async (res) => {
            if (res.status != 200)
                return
            const result = await res.blob()
            console.log(key)
            FileSender(socket, result, p, id)
        })
    }
       
}