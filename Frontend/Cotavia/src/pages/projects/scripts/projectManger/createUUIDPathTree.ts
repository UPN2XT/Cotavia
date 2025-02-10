import { Folder } from "../../components/DirectoryViewer";
import { UUIDPATHS } from "../../../../context/projectContext";

const create = (root: Folder, path: string, isRoot: boolean = true) => {
    const UUIDLIST: UUIDPATHS = {folders: {}, files: {}}
    const rootRef = isRoot? '': path+`${root.name}/`
    UUIDLIST.folders[root.UUID] = rootRef
    if (root.folders != null) 
        for (const key in root.folders) {
            const u = create(root.folders[key], rootRef, false)
            UUIDLIST.folders = {...UUIDLIST.folders, ...u.folders}
            UUIDLIST.files = {...UUIDLIST.files, ...u.files}
        }
           
        if (root.files != null)
            for (const key in root.files)
                UUIDLIST.files[root.files[key].UUID] = rootRef+key
        
        return UUIDLIST
}

export default create