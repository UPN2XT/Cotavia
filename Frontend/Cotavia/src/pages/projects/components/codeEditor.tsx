import { ChangeEventHandler } from "react"

interface useProps
{
    data: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>
    path: string
}

export default function(parms: useProps) {
    return (
        <div className="flex-grow flex flex-col">
            <text className="p-1 border-2 border-black rounded-lg">{parms.path}</text>
            <textarea value={parms.data} onChange={parms.onChange} 
                className="flex-grow h-full resize-none border-2 border-black rounded-lg p-4">

            </textarea>
        </div>
    )
}