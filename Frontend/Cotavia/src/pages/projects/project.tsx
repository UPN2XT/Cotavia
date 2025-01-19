import { useState, useEffect } from "react"
import { useParams } from "react-router"
import useCrf from "../../hooks/useCrf"
import applicationData from "../../data"
import CodeEditor from "./components/codeEditor"
import DirectoryViewer from "./components/DirectoryViewer"
import { Folder } from "./components/DirectoryViewer"
import { createFolder, UpdateFile } from "./scripts/Updater"


export default function() {

    const [dictionary, setDictionary] = useState<Folder>(
        { 
            name: '11111111111', 
            folders: {
                '2': {
                    name: '22222222222',
                    folders: {},
                    files: {}
                }
            }, 
            files: {}
        } 
    )
    const {id} = useParams()
    const [codeText, setCodeText] = useState<string>("")
    const [currentPath, setCurentPath] = useState<string>("")

    const socketHandler = () => {
        const socket = new WebSocket(`${applicationData.WsHost}ws/projects/update/${id}/`);
        socket.onopen = function(event) {
            console.log(event.timeStamp)
        };
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data)
            console.log(data)
            if (data["event"] == "create/folder")
                setDictionary(d => createFolder(d, data))
            if (data["event"] == "update/file")
                setDictionary(d => UpdateFile(d, data))
        }
    }

    const updateCode = () => {
        const body = useCrf()
        body.append('ID', String(id))
        fetch(applicationData.host+"projects/getProject", {method: 'POST', body: body})
        .then(res => res.json())
        .then(result => setDictionary(result.filePath))
        .then(() => socketHandler())
    }

    const updateFile = async () => {
        const body = useCrf()
        body.append('ID', String(id))
        body.append('path', currentPath)
        body.append('data', codeText)
        fetch(applicationData.host+"projects/updateFile", {method: 'POST', body: body})
        .then(res => console.log(res.status))
    }

    useEffect(() => {
        updateCode()
    }, [])
    return (
        <div className="flex h-full drop-shadow-md border-2 border-neutral-900 rounded-md">
            <DirectoryViewer id={id} setCodeText={setCodeText} setCurentPath={setCurentPath} Dir={dictionary}/>
            <CodeEditor data={codeText} onChange={(value) => setCodeText(value? value: "")} path={currentPath} updateFile={updateFile}/>
        </div>
    )
}