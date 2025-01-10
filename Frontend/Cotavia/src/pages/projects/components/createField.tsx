import applicationData from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { useState } from "react"

interface useProps{
    updateCode: Function
    id: string,
    rootRef: string,
}

export default function(props: useProps) {
    const [nameVal, setnameVal] = useState<string>("")
    const creFolder = () => Create(props.rootRef, nameVal, "folder", "")
    const creFile = () => Create(props.rootRef, nameVal, "file", "")
    const Create = (path: string, name: string, target: string, data: string) =>
    {
        const body = useCrf()
        body.append('ID', props.id)
        body.append('path', path.slice(0, path.length-1))
        body.append('name', name)
        body.append('data', data)
        fetch(applicationData.host+`projects/create/${target}`, {method:"POST", body: body})
        .then(() => props.updateCode())
    }
    return (
        <>
            <input value={nameVal} onChange={e => setnameVal(e.currentTarget.value)}/>
            <button onClick={creFile}>create file</button>
            <button onClick={creFolder}>Create Folder</button>
        </>
    )
}