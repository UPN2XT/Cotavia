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
    return props.folder ? (<h3>{props.name}: {props.path}</h3>): (<li onClick={updateFunction}>{props.name}: {props.path}</li>)
}