import { useEffect, useState } from "react"
import useCrf from "../hooks/useCrf"
import applicationData from "../data"
import { Link } from "react-router"
import BorderRoundedCard from "../components/general components/cards/BorderRoundedCard"
import CreationScreen from "./components/creationScreen"
interface Projects
{
    [name: string]: string
}

export default function() {

    const [projects, setProjects] = useState<Projects>({})
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
            (<Link className="col-span-1 h-36 border-black border-2 rounded-md p-4" 
                to={`project/${projects[project]}`}>{project}</Link>)
        )
    return (
        <>
            {showCreation && <CreationScreen setFunction={setShowCreation} />}
            <h2 className="text-2xl font-bold">
                projects
            </h2>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] p-4">
                <div onClick={() => setShowCreation(true)}>
                    <BorderRoundedCard classes="col-span-1 h-36 hover:">
                        Create New Project
                    </BorderRoundedCard>
                </div>
                {projectLinks}
            </div>
        </>
    )
}