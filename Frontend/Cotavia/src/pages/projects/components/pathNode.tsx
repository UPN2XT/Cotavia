import { DocumentTextIcon } from '@heroicons/react/16/solid'

interface useProps {
    path: string,
    folder: boolean,
    name: string,
    updateFunctionText: Function,
    updateFunctionPath: Function,
    data: string
}

export default function(props:useProps)  {
    const updateFunction = () => {props.updateFunctionText(props.data); props.updateFunctionPath(props.path)}
    return props.folder ? (
        
            <h3>
                 {props.name}
            </h3>
        ): 
        (<li onClick={updateFunction} className='w-max flex items-center gap-2 font-semibold hover:cursor-default'>
            <DocumentTextIcon className='size-4'/>
            {props.name}
        </li>)
}