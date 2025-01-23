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
            <div className="rounded-lg w-fit flex flex-col gap-8 items-center backdrop-blur-lg p-12 bg-black bg-opacity-20 shadow-sm shadow-white">
                <input placeholder="Project name" className="bg-transparent bg-black shadow-inner shadow-violet-400 rounded-2xl p-5 w-96 text-2xl backdrop-blur-xl"
                    value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}/>
                <div className="flex gap-4 w-full justify-center">
                    <button className="p-2 w-32 font-semibold text-2xl bg-black shadow-inner shadow-green-400 rounded-2xl hover:bg-green-400"
                        onClick={createProject}>
                        Create</button>
                    <button className="p-2 w-32 rounded-2xl font-semibold text-2xl bg-black shadow-inner shadow-red-400 hover:bg-red-400"
                        onClick={() => props.setFunction(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}