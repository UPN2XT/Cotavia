import { ChangeEventHandler } from "react"

interface useProps
{
    data: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export default function(parms: useProps) {
    return (
        <textarea value={parms.data} onChange={parms.onChange}>

        </textarea>
    )
}