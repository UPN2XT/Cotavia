import { Outlet } from "react-router"
import RequestList from "./components/List"
export default function() {
    return (
        <div className="p-4">
            <Outlet />
            <RequestList mode="c" />
            <RequestList mode="i"/>
            <RequestList mode="o" />
        </div>
    )
}