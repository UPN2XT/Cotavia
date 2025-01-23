import { DocumentTextIcon } from '@heroicons/react/16/solid'
import { ReactNode } from 'react'
import FileContextMenu from './fileContextMenu';
import { useContext } from "react"
import { project, projectContext } from "../../../context/projectContext"
import { useParams } from 'react-router';
interface useProps {
    path: string,
    folder: boolean,
    name: string,
    data: string,
    rootRef: string
}

export default function(props:useProps)  {

    const {setData, setCurrentPath, currentPath, setContextInfo, offsetH} = useContext<project>(projectContext)
    const {id} = useParams()
    const updateFunction = () => {setData(props.data); setCurrentPath(props.path)}
    
    const handleLeft = (e: React.MouseEvent<HTMLLIElement>, children: ReactNode) => {
        e.preventDefault()
        let x
        let y
        if (e.clientX < window.innerWidth / 2)
            x = e.clientX 
        else
            x = e.clientX 
        if (e.clientY < window.innerHeight / 2)
            y = e.clientY
        else
            y = e.clientY - offsetH
        setContextInfo({
            x: x,
            y: y,
            toggle: true,
            children: children
        })
        
    }

    
    return  props.folder ? (  
                <li className='list-none'
                    onContextMenu={e => handleLeft(e, <FileContextMenu path={props.path} file={false} 
                        id={String(id)}/>)}>
                     {props.name}
                </li>
            ): 
            (<li onClick={updateFunction} className={'w-max flex items-center gap-2 font-semibold hover:cursor-default '+ (currentPath == props.path? "bg-purple-500 backdrop-blur-xl bg-opacity-30 p-2 rounded-md": "")}
                onContextMenu={e => handleLeft(e, <FileContextMenu path={props.path} file={true} 
                    id={String(id)}/>)}>
                <DocumentTextIcon className='size-4'/>
                {props.name}
            </li>)
}