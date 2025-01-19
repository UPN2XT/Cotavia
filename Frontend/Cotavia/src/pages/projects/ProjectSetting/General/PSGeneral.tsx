export default function() {
    return (
        <>
            <text className="text-3xl font-bold">
                General
            </text>
            <div className="p-4">
                <div className="flex items-center">
                    <label>Project Name</label>
                    <input className="border-black border-2 rounded-md p-1 text-sm font-medium m-2"/>
                </div>
                <div className="flex items-center">
                    <label>Public</label>
                    <input type="checkbox" className="border-black border-2 rounded- p-1 text-sm font-medium m-2"/>
                </div>
                <div className="flex items-center">
                    <input type="sumbit" className="border-black border-2 rounded-md p-2 text-sm font-medium m-2 w-12" value="save"/>
                </div>
            </div>
        </>
    )
}