import { ReactNode } from "react"


interface useProps {
  children: ReactNode,
  classes: string
}

export default function(props: useProps) {
    return (
        <div className={"flex scroll-smooth overflow-x-scroll gap-4 scroll p-1 "+props.classes}>
            {props.children}
        </div>
    )
}