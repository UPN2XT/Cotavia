import { Outlet } from "react-router"
import ProjectSettingsSidebar from "./components/ProjectSettingsSidebar"

export default function() {
    return (
        <div className="flex h-[90vh]">
            <ProjectSettingsSidebar />
            <div className="flex-grow p-4 h-full">
                <Outlet />
            </div>
        </div>
    )
}