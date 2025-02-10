import { Link } from "react-router"
import { FaceFrownIcon, Squares2X2Icon } from "@heroicons/react/16/solid"
import data from "./data"
export default function() {
    return (
        <div className="p-6 m-0 h-screen w-screen flex flex-col gap-4 justify-center items-center
            bg-gradient-to-tr from-neutral-950 to-neutral-900 text-gray-100 max-h-screen ">
            <div className="flex gap-4 items-center">
                <FaceFrownIcon className="size-40"/>
                <h1 className="text-9xl font-extrabold select-none">
                    404
                </h1>
            </div> 
            <Link to={data.host} className="text-2xl underline underline-offset-2 flex gap-2 items-center">
                <Squares2X2Icon className="size-10"/>Go to home
            </Link>
            
        </div>
    )
}