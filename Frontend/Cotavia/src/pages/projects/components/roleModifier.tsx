import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/16/solid"
import data from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { projectContext, project, InfoMenu } from "../../../context/projectContext"
import { useEffect, useContext, useState } from "react"
import { useParams } from "react-router"


export default function() {

    const {MenuInfo, setMenuInfo} = useContext<project>(projectContext)
    const [roles, setRoles] = useState<{
        In: string[],
        Out: string[],
        visblity: string
    }>({In: [], Out: [], visblity: "F"})
    const {id} = useParams()

    const [added, setAdd] = useState<string[]>([])
    const [removed, setRemoved] = useState<string[]>([])

    const createData = (s: {[x: number]: string}) => {
        const In = []
        for (const i in s)
            In.push(s[i])
        return In
    }

    const save = async () => {
        const body = useCrf()
        body.append("ID", String(id))
        body.append("Type", MenuInfo.type)
        body.append("UUID", MenuInfo.UUID)
        body.append("add", JSON.stringify(added))
        body.append("remove", JSON.stringify(removed))
        body.append("path", MenuInfo.path)
        const res = await fetch(data.host+"projects/roles/dir/update", {
            method: "POST",
            body: body
        })

        if (res.status != 200)
            return

        setAdd([])
        setRemoved([])
    }

    const modifyRole = async (remove: boolean, name: string) => {
        if (remove) {
            setRemoved(prev => [...prev, name])
            setAdd(prev => prev.filter(e => e != name))
        } else {
            setAdd(prev => [...prev, name])
            setRemoved(prev => prev.filter(e => e != name))
        }

        const re = (s: string[]) => s.filter(e => e != name)
        const add = (s: string[]) => [...s, name]
        
        if (remove) 
            setRoles (prev => ({
                In: re(prev.In),
                Out: add(prev.Out),
                visblity: prev.visblity
            }))
        else
            setRoles (prev => ({
                Out: re(prev.Out),
                In: add(prev.In),
                visblity: prev.visblity
            }))

    }

    const createList = (s: string[], remove: boolean) => {
        const In = []
            for (const i in s)
                In.push((
            <div className="min-w-20 bg-black backdrop-blur-xl bg-opacity-20 p-4 flex justify-between rounded-md">
                <div>
                    {s[i]}
                </div>
                <div onClick={() => modifyRole(remove, s[i])}>
                    {remove? <MinusIcon className="size-6" /> : <PlusIcon className="size-6" />}
                </div>
            </div>
        ))
        return In
    }

    const loadInfo =  () => {
            const body = useCrf()
            body.append("ID", String(id))
            body.append("Type", MenuInfo.type)
            body.append("UUID", MenuInfo.UUID)
            fetch(data.host+"projects/roles/dir/get", {method: "POST", body:body})
            .then(res => res.json())
            .then(result => {
                setRoles({
                    In: createData(result.rolesIn),
                    Out: createData(result.rolesOut),
                    visblity: result.limited? "T": "F"
                })
            })
    }

    useEffect(() => {loadInfo()}, [MenuInfo])

    const x = MenuInfo.path.split("/")

    return (
        <div className=" h-full w-max bg-neutral-800 rounded-md shadow-sm shadow-neutral-950 
            p-4 min-w-60 overflow-x-scroll scroll overflow-y-scroll flex flex-col gap-2">
            <div className="flex justify-between items-center border-b-2 border-green-400 pb-1">
                <div className="mb-2 text-xl font-semibold">
                    {x[x.length - 1]}
                </div>
                <XMarkIcon className="size-6" onClick={() => setMenuInfo((prev: InfoMenu) => ({
                    ...prev, toggle: false
                }))}/>
            </div>
            <div className="w-fit flex gap-3 items-center">
                <div>
                    Limited Visiblity
                </div>
                <select className="bg-neutral-800 rounded-md p-1 text-md text-center" value={String(roles.visblity)}
                    onChange={async (e) => {
                        const body = useCrf()
                        body.append("ID", String(id))
                        body.append("Type", MenuInfo.type)
                        body.append("path", MenuInfo.path)
                        body.append("action", e.target.value)
                        body.append("UUID", MenuInfo.UUID)
                        const res = await fetch(data.host+"projects/roles/dir/visiblity", {
                            method: "POST",
                            body: body
                        })

                        if (res.status == 200)
                            loadInfo()
                    }}>
                    <option value={"T"}>
                        True
                    </option>
                    <option value={"F"}>
                        False
                    </option>
                </select>
            </div>
            <button className="w-full bg-green-500 rounded-lg flex 
                    justify-center items-center pt-2 pb-2 pl-3 pr-3"
                onClick={save}>
                Save
            </button>
            {
                roles.In.length > 0 && (
                    <>
                        <div className="text-xl text-md">
                            Remove
                        </div>
                        <div className="flex flex-col gap-2">
                            {createList(roles.In, true)}
                        </div>
                    </>
                )
            }
            
            {
                roles.Out.length > 0 && (
                    <>
                        <div className="text-xl text-md">
                            Add
                        </div>
                        <div className="flex flex-col gap-2">
                            {createList(roles.Out, false)}
                        </div>
                    </>
                )
            }


            
        </div>
    )
}