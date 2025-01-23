import data from "../../../../../data";
import useCrf from "../../../../../hooks/useCrf";
import RoleUserCard from "./RoleUserCard";
import {user} from  "../../Users/components/userCard"
import { XMarkIcon } from "@heroicons/react/16/solid"
import { useEffect, useState } from "react"

interface useProps {
    setFunction: Function;
    roleName: string;
    id: string;
}

interface UserList {
    [usrname: string]: user
}

interface res {
    usersIn: UserList
    usersOut: UserList
}

export default function(props: useProps) {

    const [usersIn, setUsersIn] = useState<user[]>([])
    const [usersOut, setUsersOut] = useState<user[]>([])

    const loadUsers = (setFun: Function, us: UserList) => {
        const usIn: user[] = []
            for (const key in us)
                usIn.push({
                    username: key,
                    pfp: us[key].pfp,
                    displayname: us[key].displayname
            })
        setFun(usIn)
    }

    const removeFunction = (us: user, setFunction: Function) => setFunction(
        (uses: user[]) => uses.filter(u => u.username != us.username)
    )

    const addFunction = (us: user, setFunction: Function) => setFunction(
        (uses: user[]) => [...uses, us]
    )

    const createUsersNodes = (users: user[], isRemove: boolean, removeFunc: Function, addFunc: Function) => users.map(us => (
        <RoleUserCard user={us} removeFunc={() => removeFunc(us)} id={props.id} remove={isRemove} 
            roleName={props.roleName} addFunc={() => addFunc(us)}/>
    ))

    useEffect(() => {
        const body = useCrf()
        body.append("name", props.roleName)
        body.append("ID", props.id)
        fetch(data.host+"projects/settings/roles/users/get", {
            method: "POST",
            body: body
        })
        .then(res => res.json())
        .then((result: res) => {
            loadUsers(setUsersIn, result.usersIn)
            loadUsers(setUsersOut, result.usersOut)
        })
    }, [])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-35 backdrop-blur-md h-full w-full 
                flex justify-center items-center p-4 ">
            <div className="w-5/6 bg-neutral-800 rounded-md p-4 max-h-[100%] overflow-y-scroll">
                <div className="flex justify-end">
                    <XMarkIcon className="size-8"
                        onClick={() => props.setFunction(false)}/>
                </div>
                <div className="flex gap-4 flex-col">
                    <h3 className="text-xl font-medium">
                        Remove from Role
                    </h3> 
                    <div className="p-4 bg-neutral-950 rounded-md flex flex-col gap-4">
                        {createUsersNodes(usersIn, true, (us: user) => removeFunction(us, setUsersIn),
                            (us: user) => addFunction(us, setUsersOut))}
                    </div>

                    <h3 className="text-xl font-medium">
                        Add to role
                    </h3> 
                    <div className="p-4 bg-neutral-950 rounded-md flex flex-col gap-4">
                        {createUsersNodes(usersOut, false, (us: user) => removeFunction(us, setUsersOut),
                            (us: user) => addFunction(us, setUsersIn))}
                    </div>
                </div>
                
                
            </div>
           
        </div>
    )
    
}