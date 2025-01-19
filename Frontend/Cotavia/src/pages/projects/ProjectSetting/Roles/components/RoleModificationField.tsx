interface useProps {
    name: string;
    modifyFunction: Function;
    value: boolean;
    hiddenName: string;
}

export default function (props: useProps) {
    return (
        <div className="flex items-center justify-between">
            <label className="font-medium text-xl">
                {props.name}
            </label>
            <select className="bg-neutral-800 rounded-md p-3 text-lg text-center" 
                value={String(props.value)} name={props.hiddenName}
                    onChange={e => props.modifyFunction((d:object) => ({...d, [e.target.name]: e.target.value == "true"}))}>
                <option value={"true"}>True</option>
                <option value={"false"}>False</option>
                </select>
            </div>
    )
}