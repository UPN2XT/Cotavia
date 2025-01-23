import data from "../../../../../data";
import useCrf from "../../../../../hooks/useCrf";
import { useState } from "react";
import UserCardTemp from "../../components/UserCardTemp";

export interface user{
    username: string;
    displayname: string;
    pfp: string;
}

interface useProps {
    user: user;
    removeFunction: Function;
    id: string;
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
        .then(res => {
            if (res.status != 200) {
                setDisabled(false)
                return
            }
            props.removeFunction()
        })
    }

    return  (
        <UserCardTemp user={props.user} func={removeUser} disabled={disabled} remove={true}/>
    ) 
            
}