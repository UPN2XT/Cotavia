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

    const BASECLASS = "border-2 border-black rounded-lg p-1 "

    return (
        <div className="flex flex-col gap-4 text-sm">
            <input value={nameVal} className={BASECLASS}
                onChange={e => setnameVal(e.currentTarget.value)}/>
            <div className="flex gap-2">
                <button onClick={creFile} className={BASECLASS+"w-fit"}>
                    create file</button>
                <button onClick={creFolder} className={BASECLASS+"w-fit"}>
                    Create Folder</button>
            </div>
        </div>
    )
}