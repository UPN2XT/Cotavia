import { XMarkIcon } from "@heroicons/react/16/solid"
import { Folder } from "./DirectoryViewer"
import { projectContext, project } from "../../../context/projectContext"
import { useContext } from "react"

interface useProps {
    root: Folder,
    path: string, 
    setTabs: Function
    tabs: string[]
}

export default function(props: useProps) {

    const {setPath, currentPath} = useContext<project>(projectContext)

    const updateData = () => {
        setPath(props.path)
    }
    const del = () => {
        const x = props.tabs[0] != props.path
        if (props.tabs.length > 1) {
            setPath(x? props.tabs[0]: props.tabs[1])
        }
        else
            setPath("")   
        props.setTabs((s: string[]) => s.filter(s => s != props.path))
    }
    
    const x = props.path.split("/")
    return (
        <div className={'bg-white backdrop-blur-xl gap-2 rounded-lg bg-opacity-5 h-full p-2 min-w-32 max-w-60 w-fit flex justify-between items-center '
                + (currentPath == props.path? "border-2 border-purple-500": "")
        }>
                <div className='max-w-52 overflow-clip w-[90%] hover:cursor-default h-full max-h-full text-nowrap' onClick={updateData}>
                        {x[x.length - 1]}
                </div>
                <XMarkIcon className='size-6' onClick={del}/>
        </div>
    )
}