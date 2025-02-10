import { ReactNode } from "react"


interface useProps {
  children: ReactNode
  classes: string
}

export default function(props: useProps) {
    return (
        <div className={"flex-shrink-0 bg-black backdrop-blur-xl bg-opacity-35 rounded-lg p-4 "+props.classes}>
            {props.children}
        </div>
    )
}