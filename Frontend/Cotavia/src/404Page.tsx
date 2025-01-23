import { Link } from "react-router"
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid"
import data from "./data"
export default function() {
    return (
        <div className="p-6 m-0 h-screen w-screen flex flex-col gap-4 
            bg-gradient-to-tr from-neutral-950 to-neutral-900 text-gray-100 max-h-screen ">
            <div className="flex gap-4 items-center">
                <ExclamationTriangleIcon className="size-20"/>
                <h1 className="text-5xl font-extrabold">
                    URL COULD NOT FOUND
                </h1>
            </div> 
            <Link to={data.host} className="text-xl underline underline-offset-2">Go to home</Link>
            
        </div>
    )
}