import applicationData from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { useState } from "react"
import { FolderPlusIcon, DocumentPlusIcon } from "@heroicons/react/16/solid"
interface useProps{
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
    }

    return (
        <div className="flex flex-col gap-4 p-1">
            <input value={nameVal} className="bg-inherit placeholder:text-sm text-sm p-1" placeholder="name"
                onChange={e => setnameVal(e.currentTarget.value)}/>
            <div className="flex items-center gap-1">
                <button onClick={creFolder}>
                    <FolderPlusIcon className="size-4"/>
                </button>
                <button onClick={creFile}>
                    <DocumentPlusIcon className="size-4"/>
                </button>
            </div>
        </div>
    )
}