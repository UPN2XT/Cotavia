import { Outlet } from "react-router"
import RequestList from "./components/List"
import { useState } from "react"
import { Squares2X2Icon, LinkIcon, InboxArrowDownIcon, InboxStackIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid"
import { Link } from "react-router"
import Search from "./components/Search"
export default function() {

    const [tap, setTap] = useState<number>(0)

    return (
        <div className="p-4 max-h-full flex flex-col gap-4 h-full overflow-scroll w-screen">
            <div>
                <Link to="../" className="flex items-center gap-2 w-fit">
                    <Squares2X2Icon className="size-8" />
                    <div className="text-lg">
                        Codavia
                    </div>
                </Link>
            </div>
            <Outlet />
            <div className="flex flex-col gap-4 bg-neutral-800 p-4 rounded-lg flex-grow backdrop-blur-xl bg-opacity-40 drop-shadow-sm shadow-sm shadow-neutral-700">
                <div className="flex border-b-2 border-neutral-950 pb-1 gap-1 overflow-x-scroll">
                    <button className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer hover:bg-neutral-700 flex items-center gap-1 " + (tap == 0? "bg-neutral-800": "")}
                        onClick={() => setTap(0)}>
                        <LinkIcon className="size-6"/>
                        Connections
                    </button>
                    <button className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer hover:bg-neutral-700 flex items-center gap-1 " + (tap == 1? "bg-neutral-800": "")}
                        onClick={() => setTap(1)}>
                        <InboxArrowDownIcon className="size-6"/>
                        Incoming
                    </button>
                    <button className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer hover:bg-neutral-700 flex items-center gap-1 " + (tap == 2? "bg-neutral-800": "")}
                        onClick={() => setTap(2)}>
                        <InboxStackIcon className="size-6"/>
                        Outgoing
                    </button>
                    <button className={"text-xl font-semibold p-2 rounded-md hover:cursor-pointer hover:bg-neutral-700 flex items-center gap-1 " + (tap == 3? "bg-neutral-800": "")}
                        onClick={() => setTap(3)}>
                        <MagnifyingGlassCircleIcon className="size-6"/>
                        Search
                    </button>
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