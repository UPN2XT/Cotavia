import { DocumentTextIcon, CodeBracketIcon, PhotoIcon } from '@heroicons/react/16/solid'
import { ReactNode } from 'react'
import FileContextMenu from './fileContextMenu';
import { useContext } from "react"
import { project, projectContext } from "../../../context/projectContext"
import { useParams } from 'react-router';
interface useProps {
    path: string,
    folder: boolean,
    name: string,
    type?: string,
    UUID: string
}

export default function(props:useProps)  {

    const {setCurrentPath, currentPath, setContextInfo, offsetH} = useContext<project>(projectContext)
    const {id} = useParams()
    const updateFunction = () => {setCurrentPath(props.path)}
    
    const handleLeft = (e: React.MouseEvent<HTMLLIElement>, children: ReactNode) => {
        e.preventDefault()
        let x
        let y
        if (e.clientX < window.innerWidth / 2)
            x = e.clientX 
        else
            x = e.clientX 
        if (e.clientY + offsetH < window.innerHeight)
            y = e.clientY
        else if (e.clientY - offsetH < 0)
            y = e.clientY - offsetH
        else
            y = e.clientY - Math.abs((e.clientY - (e.clientY + offsetH)) % window.innerHeight)
        setContextInfo({
            x: x,
            y: y,
            toggle: true,
            children: children
        })
        
    }

    
    return  props.folder ? (  
                <li className='list-none text-lg'
                    onContextMenu={e => handleLeft(e, <FileContextMenu path={props.path} file={false} 
                        id={String(id)} UUID={props.UUID}/>)}>
                     {props.name}
                </li>
            ): 
            (<li onClick={updateFunction} className={'w-max flex items-center gap-2 font-semibold hover:cursor-default text-lg '+ (currentPath == props.path? "bg-purple-500 backdrop-blur-xl bg-opacity-30 p-2 rounded-md": "")}
                onContextMenu={e => handleLeft(e, <FileContextMenu path={props.path} file={true} 
                    id={String(id)} UUID={props.UUID}/>)}>
                {
                    props.type != null && (props.type.startsWith("text")? <CodeBracketIcon className='size-5' />:
                    props.type.startsWith("image")? <PhotoIcon className='size-5' />:
                    <DocumentTextIcon className='size-5' />)
                }
                {props.name}
            </li>)
}