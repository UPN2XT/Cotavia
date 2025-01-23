import applicationData from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { useState } from "react"

interface useProps{
    id: string,
    rootRef: string,
    toggleFunction: Function
}

export default function(props: useProps) {
    const [nameVal, setnameVal] = useState<string>("")
    const creFolder = () => Create(props.rootRef, nameVal, "folder", "")
    const creFile = () => Create(props.rootRef, nameVal, "file", "")
    
    const Create = (path: string, name: string, target: string, data: string) =>
    {
        props.toggleFunction()
        const body = useCrf()
        body.append('ID', props.id)
        body.append('path', path)
        body.append('name', name)
        body.append('data', data)
        fetch(applicationData.host+`projects/create/${target}`, {method:"POST", body: body})
    }

    return (
        <>
            <input value={nameVal} className="bg-inherit bg-opacity-25 w-full rounded-mdplaceholder:text-sm text-sm p-1" placeholder="name"
                onChange={e => setnameVal(e.currentTarget.value)}/>
            <button onClick={creFolder} className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2">
                    Create Folder
            </button>
            <button onClick={creFile} className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2">
                Create File
            </button>
        </>
    )
}