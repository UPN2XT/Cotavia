import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid"
import RoleModificationField from "./RoleModificationField";
import data from "../../../../../data";
import useCrf from "../../../../../hooks/useCrf";
import UserRoles from "./UserRoles";
export interface Role {
    isAdmin: boolean;
    canCreate: boolean;
    canDelete: boolean;
    canModifyFiles: boolean;
    isDefualt: boolean;
    name: string;
}

interface useProps {
    role: Role;
    id: string
}

export default function({role, id}: useProps) {

    const [show, setShow] = useState<boolean>(false)
    const [roleState, setRoleState] = useState<Role>(role)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showUsers, setShowUsers] = useState<boolean>(false)

    const updateRole = () => fetch(data.host+"projects/settings/roles/updateRole", {
        method: "POST",
        body: (() => {
            setDisabled(true)
            const body = useCrf()
            body.append("action", "update")
            body.append("ID", id)
            body.append("data", JSON.stringify(roleState))
            return body
        })()
    }) 
    .then(result => result.status == 200 && setDisabled(false))

    return (
        <div className="bg-neutral-900 rounded-2xl p-4 w-full">
            <div className={showUsers? "visible": "hidden"}>
                <UserRoles setFunction={setShowUsers} roleName={role.name} id={String(id)}/>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">
                    {roleState.name}
                </div>
                <div onClick={() => setShow(s => !s)}>
                    {show? <ChevronUpIcon className="size-8"/>:<ChevronDownIcon className="size-8"/>}
                </div>
            </div>
            {show && (
                <div className="p-4 flex flex-col gap-4">
                    
                    <RoleModificationField name="Admin" hiddenName="isAdmin" value={roleState.isAdmin} modifyFunction={setRoleState}/>
                    <RoleModificationField name="Can Create" hiddenName="canCreate" value={roleState.canCreate} modifyFunction={setRoleState}/>
                    <RoleModificationField name="Can Delete" hiddenName="canDelete" value={roleState.canDelete} modifyFunction={setRoleState}/>
                    <RoleModificationField name="Can Modify" hiddenName="canModifyFiles" value={roleState.canModifyFiles} modifyFunction={setRoleState}/>
                    <div className="flex justify-end">
                        {!role.isDefualt && (
                            <button className="bg-red-500 p-3 font-bold rounded-xl m-4"
                                disabled={disabled}>
                                Delete
                            </button>
                        )}
                        <button className="bg-green-500 p-3 font-bold rounded-xl m-4"
                            disabled={disabled} onClick={updateRole}>
                            Save
                        </button>
                    </div>
                    <div>
                        <button className="text-xl font-medium"
                            onClick={() => setShowUsers(true)}>
                            users
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}