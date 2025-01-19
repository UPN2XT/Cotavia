import PathNone from "./pathNode"
import FolderNode from "./folderNode"
export interface Folder 
{
    name: string,
    folders: SubFolders,
    files: SubFiles 
}

export interface SubFolders
{
    [key: string]: Folder
}

export interface SubFiles
{
    [key: string]: string
}

interface useProps {
    id: string | undefined;
    setCodeText: Function;
    setCurentPath: Function;
    Dir: Folder
}
export default function({id, setCodeText, setCurentPath, Dir}: useProps) {
    const createFilelocation = (root: Folder, path: string, isRoot: boolean) => {
            const subFolders = []
            const rootRef = isRoot? '': path+`${root.name}/`
            if (root.folders != null) 
                for (const key in root.folders)
                    subFolders.push((<li>{createFilelocation(root.folders[key], rootRef, false)}</li>))
            const subFiles = []
            if (root.files != null)
                for (const key in root.files)
                    subFiles.push((<PathNone name={key} path={rootRef+key} folder={false} data={root.files[key]} updateFunctionText={setCodeText} updateFunctionPath={setCurentPath} />))
            
            
            return (
                <FolderNode id={id} root={root} rootRef={rootRef}
                    path={path} subFolders={subFolders} subFiles={subFiles}
                    setCodeText={setCodeText} setCurentPath={setCurentPath}/>
            )
        }
    return (
        <div className=" h-full w-max max-h-[80vh] p-2 scroll-smooth overflow-x-scroll scroll overflow-y-scroll border-r-neutral-900 border-r-2">
            {createFilelocation(Dir, "", true)}
        </div>
    )
}