import PathNone from "./pathNode"
import FolderNode from "./folderNode"

export interface Folder 
{
    name: string,
    UUID: string,
    folders: {[name: string]: Folder},
    files:  {[name: string]: FileContainer},
}

export interface FileContainer 
{
    version: number,
    type: string,
    UUID: string
}

interface useProps {
    Dir: Folder,
}
export default function({Dir}: useProps) {

    const createFilelocation = (root: Folder, path: string, isRoot: boolean) => {
            const subFolders = []
            const rootRef = isRoot? '': path+`${root.name}/`
            if (root.folders != null) 
                for (const key in root.folders)
                    subFolders.push((<li>{createFilelocation(root.folders[key], rootRef, false)}</li>))
            const subFiles = []
            if (root.files != null)
                for (const key in root.files)
                    subFiles.push((<PathNone name={key} path={rootRef+key} folder={false} type={root.files[key].type}
                        UUID={root.files[key].UUID}/>))
            
            
            return (
                <FolderNode root={root} 
                    path={path} subFolders={subFolders} subFiles={subFiles} isRoot={isRoot}
                    />
            )
        }
    return (
        <div className=" h-full w-max bg-neutral-800 rounded-md shadow-sm shadow-neutral-950 p-4 min-w-60 overflow-x-scroll scroll overflow-y-scroll">
            <div className="mb-2 text-xl font-semibold border-b-2 border-purple-400 pb-1">
                Explorer
            </div>
            {createFilelocation(Dir, "", true)}
        </div>
    )
}