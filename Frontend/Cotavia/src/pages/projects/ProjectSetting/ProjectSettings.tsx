import { Outlet } from "react-router"
import ProjectSettingsSidebar from "./components/ProjectSettingsSidebar"
import { permisionContext, permisions } from "../../../context/permisionsContext"
import { useContext } from "react"
import { Link } from "react-router"
import { ShieldExclamationIcon, CodeBracketIcon } from "@heroicons/react/16/solid"

export default function() {

    const {isAdmin} = useContext<permisions>(permisionContext)

    return (
        <>
            <div className={"p-4 h-screen w-screen flex flex-col justify-center items-center " + (!isAdmin? "visible": "hidden")}>
                <div className="text-4xl font-medium flex gap-2">
                    <ShieldExclamationIcon className="size-12"/> Admin Restricted
                </div>
                <Link to="../" className="flex gap-2 text-2xl items-center">
                    Back <CodeBracketIcon className="size-6"/>
                </Link>
            </div>
            <div className={"flex h-screen max-h-screen p-4 overflow-scroll " + (isAdmin? "visible": "hidden")}>
                <ProjectSettingsSidebar />
                <div className="flex-grow p-5 h-full">
                    <Outlet />
                </div>
            </div>
        </>
        
    )
}