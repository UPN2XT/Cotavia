import { ShareIcon, PlusIcon } from "@heroicons/react/16/solid"
import { useState, useEffect } from "react"
import UserCard from "./components/userCard"
import {user} from "./components/userCard"
import { useParams } from "react-router"
import fetchUsers from "./scripts/userFetching"
import data from "../../../../data"
import useCrf from "../../../../hooks/useCrf"

export default function() {

    const {id} = useParams()
    const [usersIn, setUsersIn] = useState<user[]>([])
    const [usersFromConnections, setUsersFromConnections] = useState<user[]>([])
    const [val, setVal] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)

    const removeUser = (username: string, setFunction: Function) => setFunction(
        (users: user[]) => users.filter(us => us.username != username)
    )

    const addUser = (username: string) => {
        if (disabled) return
        setDisabled(true)
        const body = useCrf()
        body.append("ID", String(id))
        body.append("username", username)
        fetch(data.host+"projects/settings/users/add", {
            method: "POST",
            body: body
        })
        .then(() => {
            setUsersIn(prev => ([...prev, usersFromConnections.filter(user => user.username == username)[0]]))
            removeUser(username, setUsersFromConnections)
            setDisabled(false)
            setVal("0")
        })
        .catch(() => setDisabled(false))
    }

    useEffect(() => {
        fetchUsers("projects/settings/users/get/projectUsers", setUsersIn, id)
        fetchUsers("projects/settings/users/get/connections", setUsersFromConnections, id)
    }, [])

    const userCards = usersIn.map(us => (
        <UserCard user={us} removeFunction={() => removeUser(us.username, setUsersIn)} id={String(id)} />
    ))

    const connectionOptions = usersFromConnections.map((us, i) => (
        <option value={i}>{us.displayname}@{us.username}</option>
    ))

    const pfp = usersFromConnections.length == 0? "": usersFromConnections[Number(val)].pfp

    return (
        <div className="flex flex-col h-full">
            <div className="flex w-4/6 justify-between items-center">
                <h1 className="text-3xl font-bold">
                    Users
                </h1>
                <div className="flex gap-1 items-center">
                    {pfp != "" && <img className="size-8 rounded-full" src={pfp}/>}
                    <select className="bg-neutral-800 p-2 rounded-lg" value={val}
                        onChange={e => 
                                setVal(e.target.value)
                        }>
                        {connectionOptions}
                    </select>
                    <PlusIcon className="size-8" onClick={() => addUser(usersFromConnections[Number(val)].username)}/>
                    <ShareIcon className="size-8"/> 
                </div>
            </div>
            <div className="flex flex-col overflow-y-scroll p-4 gap-4">
                {userCards.length > 0? userCards: (<text className="text-lg"> No Users</text>)}
            </div>
            
        </div>
    )
}