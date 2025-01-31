import { getFile } from "../../projects/scripts/Updater";
import { Folder } from "../../projects/components/DirectoryViewer";
import updateTextCode from "../../projects/scripts/projectManger/updateTextCode";
import GetFile from "./getFile";

export default async function(data: string, path: string, LinkDirectory: Folder, coreDir: Folder,
    setCodeText: Function, id: string, setChache: Function, status: boolean) {
    console.log("stat ",status)
    if (!status) {
        const file = getFile(coreDir, path)
        if (file == null) return
        const blob = await GetFile(path, id)
        if (blob == null) return
        updateTextCode(setCodeText, path, null, id, setChache, file, blob, true)
    }
    const file = getFile(LinkDirectory, path)
    if (file == null) return
    console.log("file ",file)
    const byteCharacters = atob(data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    console.log("here")
    const blob = new Blob([byteArray], { type: file.type })
    updateTextCode(setCodeText, path, null, id, setChache, file, blob, false)

}