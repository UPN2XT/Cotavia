import { Link } from "react-router";

export default function() {
    return (
        <div className="flex-grow-0 flex flex-col gap-4 min-w-40 p-4">
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
    )
}