import { useState, useEffect } from "react"
import { useParams } from "react-router"
import useCrf from "../../hooks/useCrf"
import applicationData from "../../data"
import CodeEditor from "./components/codeEditor"
import DirectoryViewer from "./components/DirectoryViewer"
import { Folder } from "./components/DirectoryViewer"



export default function() {

    const [dictionary, setDictionary] = useState<Folder>(
        {
            name: '1', 
            folders: {
                '2': {
                    name: '2',
                    folders: {},
                    files: {}
                }
            }, 
            files: {'sub': 'hello'}}
    )
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

    useEffect(() => {
        updateCode()
    }, [])
    return (
        <div className="flex gap-4 h-full">
            <DirectoryViewer updateCode={updateCode} id={id} setCodeText={setCodeText} setCurentPath={setCurentPath} Dir={dictionary}/>
            <CodeEditor data={codeText} onChange={(e) => setCodeText(e.currentTarget.value)} path={currentPath}/>
            {currentPath != "" && (<button onClick={updateFilde}>save</button>)} <br />
        </div>
    )
}