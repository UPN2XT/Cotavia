import { useState, useEffect } from "react"
import PathNone from "./components/pathNone"
import { useParams } from "react-router"
import useCrf from "../../hooks/useCrf"
import applicationData from "../../data"
import CodeEditor from "./components/codeEditor"
import CreateField from "./components/createField"

interface Folder 
{
    name: string,
    folders: SubFolders,
    files: SubFiles 
}

interface SubFolders
{
    [key: string]: Folder
}

interface SubFiles
{
    [key: string]: string
}


export default function() {

    const [dictionary, setDictionary] = useState<Folder>({name: '', folders: {}, files: {}})
    const {id} = useParams()
    const [codeText, setCodeText] = useState<string>("")
    const [currentPath, setCurentPath] = useState<string>("")

    const updateCode = () => {
        const body = useCrf()
        body.append('ID', String(id))
        fetch(applicationData.host+"projects/getProject", {method: 'POST', body: body})
        .then(res => res.json())
        .then(result => setDictionary(result.filePath))
    }

    const updateFilde = async () => {
        const body = useCrf()
        body.append('ID', String(id))
        body.append('path', currentPath)
        body.append('data', codeText)
        fetch(applicationData.host+"projects/updateFile", {method: 'POST', body: body})
        .then(res => console.log(res.status))
        .then(() => updateCode())
    }
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
            <>
                <PathNone name={root.name} path={path+root.name} folder={true} data="" updateFunctionText={setCodeText} updateFunctionPath={setCurentPath}/>
                <CreateField updateCode={updateCode} id={String(id)} rootRef={rootRef}/>
                <ul>
                    {subFolders}
                </ul>
                <ul>
                    {subFiles}
                </ul>
            </>
        )
    }

    useEffect(() => {
        updateCode()
    }, [])
    return (
        <div>
            <button onClick={updateCode}>refresh</button> <br />
            <CodeEditor data={codeText} onChange={(e) => setCodeText(e.currentTarget.value)}/>
            <p>{currentPath}</p>
            {currentPath != "" && (<button onClick={updateFilde}>save</button>)} <br />
            
            {createFilelocation(dictionary, "", true)}
        </div>
    )
}