import applicationData from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { useState } from "react"
import useCreateTextFile from "../../../hooks/useCreateTextFile"
import useFileUpload from "../../../hooks/useFileUpload"
interface useProps{
    id: string,
    rootRef: string,
    toggleFunction: Function
}

export default function(props: useProps) {
    const [nameVal, setnameVal] = useState<string>("")

    const upload = async () => {
        props.toggleFunction()
        const files = await useFileUpload()
        if (files == null) return
        for (const file of files)
            create(props.rootRef, file.name, file.type, file, true)
    }

    const create = (path: string, name: string, type: string, file: File | null, isFile:boolean) => {
        const body = useCrf()
        body.append('ID', props.id)
        body.append('path', path)
        body.append('name', name)
        file && body.append('data', file)
        body.append("Type", type)
        fetch(applicationData.host+`projects/create/${isFile?"file":"folder"}`, {method:"POST", body: body})
    }

    const createFile = () => {
        props.toggleFunction()
        const file = useCreateTextFile(nameVal, "...")
        create(props.rootRef, nameVal, file.type, file, true)
    }

    const createFolder = () => {
        props.toggleFunction()
        create(props.rootRef, nameVal, "", null, false)
    }


    return (
        <>
            <input value={nameVal} className="bg-inherit bg-opacity-25 w-full rounded-mdplaceholder:text-sm text-sm p-1" placeholder="name"
                onChange={e => setnameVal(e.currentTarget.value)}/>
            <button onClick={createFolder} className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2">
                    Create Folder
            </button>
            <button onClick={createFile} className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2">
                Create File
            </button>
            <button onClick={upload} className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2">
                Upload
            </button>
        </>
    )
}