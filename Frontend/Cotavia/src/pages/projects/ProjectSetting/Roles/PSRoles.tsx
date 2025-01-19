import RoleComponent from "./components/RoleComponent"
import { Role } from "./components/RoleComponent"
import data from "../../../../data"
import useCrf from "../../../../hooks/useCrf"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { PlusIcon, MinusIcon } from "@heroicons/react/16/solid"

interface incoming {
    [name: string]: Role
}

const BASEROLEDATA: Role = {
    name: "",
    isAdmin: false,
    isDefualt: false,
    canCreate: true,
    canDelete: true,
    canModifyFiles: true
}
export default function() {

    const {id} = useParams()
    const [roles, setRoles] = useState<Role[]>([])
    const [disabled, setDisabled] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")
    useEffect(() => {
        const body = useCrf()
        body.append("ID", String(id))
        fetch(data.host+"projects/settings/roles/getRoles", {
            method:"POST",
            body: body
        })
        .then(res=>res.json())
        .then((result: incoming) => {
            const rs: Role[] = []
            for (const key in result)
                rs.push(
                    {
                        ...result[key],
                        name: key
                    }
                )
            setRoles(rs)
        })
    }, [])
    
    const Create = () => fetch(data.host+"projects/settings/roles/updateRole", {
            method: "POST",
            body: (() => {
                setDisabled(true)
                const body = useCrf()
                body.append("action", "create")
                body.append("ID", String(id))
                body.append("data", JSON.stringify({
                    ...BASEROLEDATA,
                    name: value
                }))
                return body
            })()
        }) 
        .then(() => {
            setDisabled(false)
            setRoles(r => [...r, {
                ...BASEROLEDATA,
                name: value
            }])
        })
        .catch(() => setDisabled(false))
    

    const roleComponents = roles.map(r => (
        <RoleComponent role={r} id={String(id)}/>
    ))

    return (
        <div className="h-full flex flex-col">
            <div className={"flex items-center gap-8"}>
                <h2 className="text-3xl font-bold">Roles</h2>
                <div className="border-2 border-white rounded-lg hover:bg-white hover:text-zinc-950"
                    onClick={() => setShow(s => !s)}>
                    {show? <MinusIcon className="size-7"/>: <PlusIcon className="size-7"/>}
                </div>
            </div>
            {show && (
                <div className="flex gap-4 mt-4">
                    <input className="w-52 bg-neutral-800 rounded-md p-1" placeholder="Role name"
                        value={value} onChange={e => setValue(e.target.value)}/>
                    <button className="bg-green-500 p-2 rounded-lg text-base font-bold" disabled={disabled}
                        onClick={Create}>
                        Add
                    </button>
                </div>
            )}
            
            <div className="p-2 gap-4 flex-col flex items-end w-4/6 overflow-y-scroll">
                {roleComponents}
            </div>
            
        </div>
    )
}