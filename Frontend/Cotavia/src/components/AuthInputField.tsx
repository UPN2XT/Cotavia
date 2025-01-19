interface useProps
{
    [name: string]: any
}

export default function(props: useProps) {
    return (
        <input className="border-2 border-black rounded-xl p-2 font-normal mb-4 text-md shadow" {...props}/>
    )
}