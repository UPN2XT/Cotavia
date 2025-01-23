import { Outlet } from "react-router"
import RequestList from "./components/List"
import { useState } from "react"
import { HomeIcon } from "@heroicons/react/16/solid"
import { Link } from "react-router"
import Search from "./components/Search"
export default function() {

    const [tap, setTap] = useState<number>(0)

    return (
        <div className="p-4 max-h-full flex flex-col gap-4 h-full overflow-scroll">
            <div>
                <Link to="../" className="flex items-center gap-2">
                    <HomeIcon className="size-8" />
                    <div className="text-lg">
                        Home
                    </div>
                </Link>
            </div>
            <Outlet />
            <div className="flex flex-col gap-4 bg-neutral-800 p-4 rounded-lg flex-grow">
                <div className="flex border-b-2 border-neutral-950 pb-1 gap-1">
                    <text className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer " + (tap == 0? "bg-neutral-900": "")}
                        onClick={() => setTap(0)}>
                        Connections
                    </text>
                    <text className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer " + (tap == 1? "bg-neutral-900": "")}
                        onClick={() => setTap(1)}>
                        Incoming
                    </text>
                    <text className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer " + (tap == 2? "bg-neutral-900": "")}
                        onClick={() => setTap(2)}>
                        Outgoing
                    </text>
                    <text className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer " + (tap == 3? "bg-neutral-900": "")}
                        onClick={() => setTap(3)}>
                        Search
                    </text>
                </div>
                <div className={tap == 0? "visible": "hidden"}>
                    <RequestList mode="c" reload={tap == 0}/>
                </div>
                <div className={tap == 1? "visible": "hidden"}>
                    <RequestList mode="i" reload={tap == 1}/>
                </div>
                <div className={tap == 2? "visible": "hidden"}>
                    <RequestList mode="o" reload={tap == 2}/>
                </div>
                <div className={tap == 3? "visible": "hidden"}>
                    <Search />
                </div>
            </div>
        </div>
    )
}