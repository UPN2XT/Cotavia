import { ReactNode } from "react"


interface useProps {
  children: ReactNode
  classes: string
}

export default function(props: useProps) {
    return (
        <div className={"flex-shrink-0 border-2 border-black rounded-md p-2 "+props.classes}>
            {props.children}
        </div>
    )
}