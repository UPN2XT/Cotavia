import { useEffect, useState } from "react"
import useCrf from "../hooks/useCrf"
import applicationData from "../data"
import { Link } from "react-router"
import CreationScreen from "./components/creationScreen"
import Nav from "../components/nav"
import { PlusIcon, ArchiveBoxXMarkIcon, Square3Stack3DIcon, InformationCircleIcon } from "@heroicons/react/16/solid"
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
    "bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#f43f5e] via-[#be185d] to-[#831843]",

    // 🔥 Warm Colors
    "bg-gradient-to-r from-rose-600 to-pink-700",
    "bg-gradient-to-r from-red-700 to-rose-800",
    "bg-gradient-to-r from-orange-600 to-amber-700",
    "bg-gradient-to-r from-yellow-600 to-amber-800",

    // ❄️ Cool Colors
    "bg-gradient-to-r from-teal-500 to-teal-900",
    "bg-gradient-to-r from-sky-500 to-blue-700",
    "bg-gradient-to-r from-indigo-900 to-gray-800",
    "bg-gradient-to-r from-blue-900 to-cyan-700",
    "bg-gradient-to-r from-green-700 to-lime-800",
    "bg-gradient-to-r from-cyan-500 to-teal-800",

    // 🍇 Purple & Pink Shades
    "bg-gradient-to-r from-purple-700 to-fuchsia-800",
    "bg-gradient-to-r from-[#6d28d9] to-[#4c1d95]", // Deep Purple
    "bg-gradient-to-r from-[#4a148c] to-[#880e4f]", // Dark Purple to Deep Pink
    "bg-gradient-to-r from-[#9c27b0] to-[#6a1b9a]", // Vibrant Purple

    // 🌌 Deep & Dark Night-Themed Gradients
    "bg-gradient-to-r from-[#0d253f] via-[#1d4b7f] to-[#0d253f]", // Midnight Deep Blue
    "bg-gradient-to-r from-[#1e293b] to-[#334155]", // Dark Slate to Grayish Blue
    "bg-gradient-to-r from-[#374151] to-[#1f2937]", // Deep Gray Gradient
    "bg-gradient-to-r from-[#0f172a] to-[#1e293b]", // Dark Navy Gradient

    // 🌊 Aqua & Oceanic Colors
    "bg-gradient-to-r from-[#008080] to-[#004d40]", // Dark Teal
    "bg-gradient-to-r from-[#14a098] to-[#0d7377]", // Deep Aqua
    "bg-gradient-to-r from-[#00695c] to-[#004d40]", // Ocean Depths

    // 🌋 Volcano & Fire-Themed
    "bg-gradient-to-r from-[#ff4500] to-[#ff8c00]", // Lava Fire Orange
    "bg-gradient-to-r from-[#8b0000] to-[#b22222]", // Dark Red Heat
    "bg-gradient-to-r from-[#d32f2f] to-[#b71c1c]", // Burning Ember Red

    // 🎭 Mystic & Fantasy Themes
    "bg-gradient-to-r from-[#2a0845] to-[#6441a5]", // Mystic Violet
    "bg-gradient-to-r from-[#6b0f1a] to-[#b91372]", // Enchanted Magenta
    "bg-gradient-to-r from-[#3a1c71] to-[#d76d77]", // Magical Twilight

    // ✨ Special Artistic Gradients
    "bg-[conic-gradient(from_180deg_at_50%_50%,_#ff6f61,_#ff8c42,_#ffb142,_#ffcc29,_#ffd700,_#ffcc29,_#ffb142,_#ff8c42,_#ff6f61)]", // Warm Sunset
    "bg-[radial-gradient(circle_at_top_left,_#0d7377,_#14a098,_#32d4c2,_#80f5e7)]", // Aqua Burst
    "bg-[radial-gradient(circle_at_center,_#4a148c,_#6a1b9a,_#9c27b0,_#ce93d8)]", // Radiant Purple Bloom
]


export default function() {

    const [projects, setProjects] = useState<Projects>({})
    const [showCreation, setShowCreation] = useState<boolean>(false)

    const leaveProject = async (id:string) =>  {
        const body = useCrf()
        body.append("ID", id)
        const res = await fetch(applicationData.host+"projects/leave", {method:'POST', body:body})
        if (res.status != 200) return
        setProjects(p => {
            const neo: {[name: string]: string} = {}
            for (const key in p)
                if (key != id)
                    neo[key] = p[key]
            return neo
        })
    }

    useEffect(() => {
        const body = useCrf()
        fetch(applicationData.host+"projects/getProjects", {method:'POST', body:body, credentials: 'include'})
        .then(res => res.json())
        .then(result => setProjects(result))
    }, [])
    const getRandomColor = () => COLOROPTIONS[Math.floor(Math.random() * COLOROPTIONS.length) % COLOROPTIONS.length]
    const projectLinks = []
    for (const project in projects)
        projectLinks.push(
            (
                <div className={"font-bold col-span-1 h-44 rounded-md p-4 text-xl hover:shadow-inner hover:shadow-neutral-900 relative group flex "
                    +getRandomColor()}>
                    <Link className="relative flex-grow"
                    to={`project/${projects[project]}`}>
                        {project}
                    </Link>
                    <div className="flex w-full h-full absolute inset-0 justify-end items-end p-4 pointer-events-none">
                            <button className=" hover:bg-white rounded-xl hover:text-black p-1 pointer-events-auto z-40"
                                title="Leave Project"
                                onClick={e => {e.preventDefault();leaveProject(project)}}>
                                <ArchiveBoxXMarkIcon  className="size-10"/>
                            </button>
                    </div>
                </div>
            )
            )
    return (
        <div className="overflow-y-scroll h-screen flex flex-col">
            <div className="fixed z-50">
                <Nav />
            </div>
            <div className="p-2 flex flex-col justify-between flex-grow">
                <div className="p-4 mt-10">
                    {showCreation && <CreationScreen setFunction={setShowCreation} />}
                    <h2 className="text-2xl font-bold flex gap-2 items-center">
                        <Square3Stack3DIcon className="size-8"/> projects ({projectLinks.length})
                    </h2>
                    <div className="hover:cursor-pointer grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4
                        border-white border-l-2 ml-3">
                        <div onClick={() => setShowCreation(true)}>
                            <div className={"font-bold col-span-1 h-44 rounded-md p-4 border-2 border-white text-xl flex justify-between hover:bg-white hover:text-black"}>
                                <div>
                                    Create New Project
                                </div>
                                <PlusIcon className="size-12 self-end"/>
                            </div>
                        </div>
                        {projectLinks}
                    </div>
                </div>
                <div className="flex justify-end p-2">
                    <Link to="help" className="flex gap-2">
                        Help <InformationCircleIcon className="size-6"/>
                    </Link>
                </div>
            </div>   
        </div>
        
    )
}