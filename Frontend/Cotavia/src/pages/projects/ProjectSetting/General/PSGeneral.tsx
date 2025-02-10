import { InformationCircleIcon } from "@heroicons/react/16/solid"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import useCrf from "../../../../hooks/useCrf"
import data from "../../../../data"

interface ProjectData {
    name: string
    users: number
    roles: number
    folders: number
    files: number
    isCreator: boolean
    usersData: string[]
}

export default function() {

    const [projectData, setProjectData] = useState<ProjectData>({name: "Loading...", users: 0, roles: 0, files: 0, folders:0, isCreator: false, usersData:[]})
    const [loaded, setLoaded] = useState<boolean>(false)
    const {id} = useParams()
    const [creator, setCreator] = useState<string>("")

    useEffect(() => {
        const body = useCrf()
        body.append('ID', String(id))
        fetch(data.host+"projects/settings/get/generalinfo", {method: 'POST', body: body})
        .then(res => res.json())
        .then(result => {setProjectData(result); setLoaded(true)})
    }, [])

    const changeName = () => {
        const body = useCrf()
        body.append('ID', String(id))
        body.append('name', projectData.name)
        fetch(data.host+"projects/settings/set/name", {method: 'POST', body: body})
    }

    const deleteProject = () => {
        const body = useCrf()
        body.append('ID', String(id))
        fetch(data.host+"projects/settings/delete", {method: 'POST', body: body})
    }

    const changeCreator = async () => {
        setLoaded(false)
        const body = useCrf()
        body.append('ID', String(id))
        body.append('username', creator)
        const res = await fetch(data.host+"projects/settings/change/creator", {method: 'POST', body: body})
        if (res.status != 200) {
            setLoaded(true)
            return
        }
        const result = await res.json()
        setProjectData(prev => ({...prev, isCreator: result.isCreator}))
    }

    const options = projectData.usersData.map(key => (<option value={key}>{key}</option>))
    
    return (
        <>
            <text className="text-3xl font-bold">
                General Settings
            </text>

            <div className="w-full bg-neutral-700 bg-opacity-30 backdrop-blur-xl p-4 rounded-lg mt-4">
                <input className="bg-transparent text-6xl font-bold focus:border-none focus:select-none" value={projectData.name}
                    onChange={e => setProjectData(prev => ({...prev, name: e.target.value}))}
                    disabled={!loaded || !projectData.isCreator}/>
                <div className="text-xl flex flex-col p-4 gap-4">
                    <div className="flex gap-1 items-center">
                        <InformationCircleIcon className="size-6"/> Info
                    </div>
                    <div className="pl-2 flex flex-col gap-4">
                        <div>
                            Users: {projectData.users} 
                        </div>
                        <div>
                            Roles: {projectData.roles}
                        </div>
                        <div>
                            Files: {projectData.files}
                        </div>
                        <div>
                            Folders: {projectData.folders}
                        </div>
                    </div>
                </div>
                
                    
                    {projectData.isCreator && (
                        <div className="flex justify-between">
                            <div className="flex gap-4">
                                <select className="px-3 py-2 bg-neutral-700 rounded-lg"
                                    value={creator}
                                    onChange={e => setCreator(e.target.value)}>
                                    {options}
                                </select>
                                <button onClick={changeCreator}>
                                    Change
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-3 py-2 bg-green-500 rounded-lg"
                                    onClick={changeName} disabled={!loaded}>
                                    save
                                </button>
                                <button className="px-3 py-2 bg-red-500 rounded-lg"
                                        onClick={deleteProject} disabled={!loaded}>
                                    delete
                                </button>
                            </div>
                        </div>
                    )}
                
            </div>
        </>
    )
}