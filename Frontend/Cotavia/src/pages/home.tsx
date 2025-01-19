import { useEffect, useState } from "react"
import useCrf from "../hooks/useCrf"
import applicationData from "../data"
import { Link } from "react-router"
import CreationScreen from "./components/creationScreen"
interface Projects
{
    [name: string]: string
}

const COLOROPTIONS = [
    "bg-gradient-to-r from-violet-600 to-indigo-600",
    "bg-gradient-to-r from-gray-400 to-neutral-700",
    "bg-gradient-to-r from-emerald-500 to-emerald-900",
    "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
    "bg-gradient-to-r from-blue-800 to-indigo-900",
    "bg-gradient-to-r from-red-500 to-orange-500",
    "bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]",
    "bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#f43f5e] via-[#be185d] to-[#831843]"
]

export default function() {

    const [projects, setProjects] = useState<Projects>({
        p1: "1",
        p2: "2",
        p3: "3"
    })
    const [showCreation, setShowCreation] = useState<boolean>(false)

    useEffect(() => {
        const body = useCrf()
        fetch(applicationData.host+"projects/getProjects", {method:'POST', body})
        .then(res => res.json())
        .then(result => setProjects(result))
    }, [])

    const projectLinks = []
    for (const project in projects)
        projectLinks.push(
            (<Link className={"font-bold col-span-1 h-36 rounded-md p-4 "+COLOROPTIONS[Math.floor(Math.random() * COLOROPTIONS.length) % COLOROPTIONS.length]}
                to={`project/${projects[project]}`}>{project}</Link>)
        )
    return (
        <div className="p-2">
            {showCreation && <CreationScreen setFunction={setShowCreation} />}
            <h2 className="text-2xl font-bold">
                projects
            </h2>
            <div className="hover:cursor-pointer grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] p-4">
                <div onClick={() => setShowCreation(true)}>
                    <div className={"font-bold col-span-1 h-36 rounded-md p-4 "+COLOROPTIONS[Math.floor(Math.random() * COLOROPTIONS.length) % COLOROPTIONS.length]}>
                        Create New Project
                    </div>
                </div>
                {projectLinks}
            </div>
        </div>
    )
}