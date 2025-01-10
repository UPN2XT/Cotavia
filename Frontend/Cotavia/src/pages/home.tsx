import { useEffect, useState } from "react"
import useCrf from "../hooks/useCrf"
import applicationData from "../data"
import { Link } from "react-router"

interface Projects
{
    [name: string]: string
}

export default function() {

    const [projects, setProjects] = useState<Projects>({})

    useEffect(() => {
        const body = useCrf()
        fetch(applicationData.host+"projects/getProjects", {method:'POST', body})
        .then(res => res.json())
        .then(result => setProjects(result))
    }, [])

    const projectLinks = []
    for (const project in projects)
        projectLinks.push((<Link to={`project/${projects[project]}`}>{project}</Link>))
    return (
        <>
            <h2>
                projects
            </h2>
            {projectLinks}
        </>
    )
}