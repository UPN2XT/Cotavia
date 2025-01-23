interface useProps
{
    [name: string]: any
}

export default function(props: useProps) {
    return (
        <input className="rounded-xl p-3 font-normal mb-4 text-md bg-neutral-950 backdrop-blur-xl bg-opacity-30 w-4/5" {...props}/>
    )
}