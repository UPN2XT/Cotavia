import { Outlet } from "react-router"
import ProjectSettingsSidebar from "./components/ProjectSettingsSidebar"
import { permisionContext, permisions } from "../../../context/permisionsContext"
import { useContext } from "react"
import { Link } from "react-router"

export default function() {

    const {isAdmin} = useContext<permisions>(permisionContext)

    return (
        <>
            <div className={"p-4 " + (!isAdmin? "visible": "hidden")}>
                <h1 className="text-3xl font-medium">
                    Admin Restricted
                </h1>
                <Link to="../" className="underline underline-offset-2">
                    Home
                </Link>
            </div>
            <div className={"flex h-screen max-h-screen p-4 overflow-scroll " + (isAdmin? "visible": "hidden")}>
                <ProjectSettingsSidebar />
                <div className="flex-grow p-4 h-full">
                    <Outlet />
                </div>
            </div>
        </>
        
    )
}