import { FileContainer } from "../../components/DirectoryViewer"
import FileSender from "../../../Link/scripts/FileSender"

interface cache {
    [path: string]: {data: Blob | string, file: FileContainer}
}

export default async function(
    setCodeText: Function, currentPath: string, socket: WebSocket | null, id: string, 
    setChache: Function, file: FileContainer, result: Blob | null, updateLink: boolean) {

        if (result == null)
            return

        updateLink && FileSender(socket, result, currentPath, String(id))
        let dx: string = ""

        if (file.type.startsWith('text'))
            dx = await result.text()
        if (file.type.startsWith('image')) 
            dx = URL.createObjectURL(result);
        setCodeText({data: dx, type: file.type})
            setChache((prev: cache) => ({...prev, [currentPath]: {
                    file: file,
                    data: dx
        }}))  
            
}