export default function() {
    return (
        <div className="fixed h-screen w-full flex flex-col justify-end z-40 p-4" style={{width: "calc(100vw - 3rem)"}}>
            <div className="w-full h-2/5 bg-neutral-800 rounded-lg select-text
                shadow-sm shadow-neutral-950 p-4  overflow-x-scroll scroll overflow-y-scroll highlight-white">
                <div className="flex flex-col gap-2">
                    <div className="flex ">
                        <span className="text-purple-400">user@cotavia</span>:
                        <span className="text-purple-400 mr-2">~</span>$
                        <input type="text" className="bg-transparent border-none text-purple-400 focus:outline-none ml-1 flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    )
}