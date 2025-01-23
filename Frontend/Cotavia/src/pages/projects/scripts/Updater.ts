import { Folder } from "../components/DirectoryViewer";

export function getDir(dir: Folder, pathS: string) {
    let current = dir
    const path = pathS.split("/")
    path.forEach(p => {
        p in current.folders && (current = current.folders[p])
    })
    return current
}

const getFolder = (root: Folder, path: string) => {
    if (path=="") return root
    const nodes = path.split("/")
    let current = root
    for (const node of nodes)
    {
        if (current == null)
            return null
        if (current.folders == null)
            return null
        current = current.folders[node]
    }
    return current
}

export const getFile = (root: Folder, path: string) => {
    const nodes = path.split("/")
    const folderPath = nodes.slice(0, -1).join("/")
    const fileName = nodes[nodes.length-1]
    const folder: Folder | null = getFolder(root, folderPath)
    if (folder == null)
        return null
    if (folder.files == null)
        return null
    return folder.files[fileName]
}

export function createFolder(d: Folder, data: any): Folder {
    const dir = JSON.parse(JSON.stringify(d));
    const pathS: string = data["path"];
    let current = dir
    const path = pathS.split("/")
    path.forEach(p => {
        current.folders!=null && p in current.folders && (current = current.folders[p])
    })
    const f: Folder = {
        name: data["name"],
        folders: {},
        files: {}
    };
    if (current.folders == null) current.folders = {}
    current.folders[data["name"]] = f;
    return dir;
}

export function UpdateFile(d: Folder, data: any): Folder {
    const dir = JSON.parse(JSON.stringify(d));
    const pathS: string = data["path"];
    let current = dir
    const path = pathS.split("/")
    path.forEach(p => {
        current.folders!=null && p in current.folders && (current = current.folders[p])
    })
    if (current.files == null) current.files = {}
    current.files[data["name"]] = data["data"]
    return dir
}

export function Delete(root: Folder, pathS: string, isFolder: boolean): Folder {
    const dir = JSON.parse(JSON.stringify(root));
    let current = dir
    let path = pathS.split("/")
    const fileName = path[path.length-1]
    path = path.slice(0, -1)
    path.forEach(p => {
        current.folders!=null && p in current.folders && (current = current.folders[p])
    })
    if (isFolder) {
        if (current.folders == null) return dir
        delete current.folders[fileName];
    }
    else {
        if (current.files == null) return dir

        delete current.files[fileName]
    }
    return dir;
}

export function Move(root: Folder, from: string, to: string,isFolder: boolean, name: string): Folder {
    const dir = JSON.parse(JSON.stringify(root));
    let current = dir
    let path = to.split("/")
    path.forEach(p => {
        current.folders!=null && p in current.folders && (current = current.folders[p])
    })
    if (isFolder) {
        const folder = getFolder(root, from)
        if (folder == null) return dir
        if (current.folders == null) current.folders = {}
        folder.name = name
        current.folders[name] = folder
    }
    else {
        if (current.files == null) current.files = {}
        const file = getFile(root, from)
        if (file == null) return dir
        current.files[name] = file
    }
    return dir;
}

