import { Folder } from "../components/DirectoryViewer";

export function getDir(dir: Folder, pathS: string) {
    let current = dir
    const path = pathS.split("/")
    path.forEach(p => {
        p in current.folders && (current = current.folders[p])
    })
    return current
}

export function createFolder(d: Folder, data: any): Folder {
    const dir = JSON.parse(JSON.stringify(d));
    console.log(dir);
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
    console.log(data.name)
    console.log(current.name)
    console.log(current)
    console.log(dir)
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
    console.log(current.name)
    console.log(dir)
    return dir
}