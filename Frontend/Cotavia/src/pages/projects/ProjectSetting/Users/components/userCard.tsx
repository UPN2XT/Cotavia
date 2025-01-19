import data from "../../../../../data";
import useCrf from "../../../../../hooks/useCrf";
import { useState } from "react";

export interface user{
    username: string;
    displayname: string;
    pfp: string;
}

interface useProps {
    user: user;
    removeFunction: Function;
    id: string
}

export default function(props: useProps) {

    const [disabled, setDisabled] = useState<boolean>(false)

    const removeUser = () => {
        setDisabled(true)
        const body = useCrf()
        body.append("ID", props.id)
        body.append("username", props.user.username)
        fetch(data.host+"projects/settings/users/remove", {
            method: "POST",
            body: body
        })
        .then(() => {
            props.removeFunction()
        })
        .catch(() => setDisabled(false))
    }

    return (
        <div className="w-4/6 bg-neutral-800 rounded-lg flex justify-between p-2 items-center">
            <div className="flex items-center gap-4">
                <img src={props.user.pfp} className="w-16 rounded-full"/>
                <div className="flex flex-col">
                    <text className="font-bold text-xl">
                        {props.user.displayname}
                    </text>
                    <text className="text-lg">
                        @{props.user.username}
                    </text>
                </div>
            </div>
            <button className="bg-red-500 pl-3 pr-3 pt-1 pb-1 rounded-xl h-12"
                onClick={removeUser} disabled={disabled}>
                Remove
            </button>
        </div>
    )
}