import { Link } from "react-router";
import { CodeBracketIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export default function() {

    const [index, setIndex] = useState<number>(0)

    return (
        <div className="flex-grow-0 flex flex-col justify-between min-w-40 p-4 bg-neutral-800 rounded-xl">
            
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">
                    Settings
                </h2>
                <Link to="" className={"border-white " + (index==0? "border-l-4 pl-2": "")}
                    onClick={() => setIndex(0)}>
                    General
                </Link>
                <Link to="roles" className={"border-white " + (index==1? "border-l-4 pl-2": "")}
                    onClick={() => setIndex(1)}>
                    Roles
                </Link>
                <Link to="users" className={"border-white " + (index==2? "border-l-4 pl-2": "")}
                    onClick={() => setIndex(2)}>
                    Users
                </Link>
            </div>
            <Link to="../">
                <CodeBracketIcon className="size-6"/>
            </Link>
        </div>
    )
}