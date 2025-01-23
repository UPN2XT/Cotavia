import { Link } from "react-router";
import { CodeBracketIcon } from "@heroicons/react/16/solid";

export default function() {
    return (
        <div className="flex-grow-0 flex flex-col justify-between min-w-40 p-4">
            
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">
                    Settings
                </h2>
                <Link to="">
                    General
                </Link>
                <Link to="roles">
                    Roles
                </Link>
                <Link to="users">
                    Users
                </Link>
            </div>
            <Link to="../">
                <CodeBracketIcon className="size-6"/>
            </Link>
        </div>
    )
}