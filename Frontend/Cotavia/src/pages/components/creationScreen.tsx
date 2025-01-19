import data from "../../data"
import useCrf from "../../hooks/useCrf"
import { useState, ChangeEvent } from "react"
import { useNavigate } from "react-router"

interface userProps {
    setFunction: Function
}



export default function(props: userProps) {

    const navigate = useNavigate()
    const [name, setName] = useState<string>("")
    const createProject = () => {
        const body = useCrf()
        body.append("name", name)
        fetch(data.host+"projects/create", {method:'POST', body:body})
        .then(res => res.json())
        .then(result => navigate("project/"+result.id))
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-35 backdrop-blur-md h-full w-full 
                flex justify-center items-center gap-4">
            <div className="rounded-lg w-1/2 flex flex-col gap-4 items-center p-4">
                <text className="text-3xl font-bold">New Project</text>
                <input placeholder="Project name" className="bg-transparent border-2 border-white rounded-lg p-3"
                    value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}/>
                <div className="flex gap-4">
                    <button className="p-2 w-32 rounded-md font-semibold"
                        onClick={createProject}>
                        Create</button>
                    <button className="p-2 w-32 rounded-md font-semibold"
                        onClick={() => props.setFunction(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}