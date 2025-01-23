import data from "../../../../../data";
import useCrf from "../../../../../hooks/useCrf";
import { useState } from "react";
import UserCardTemp from "../../components/UserCardTemp";
import { user } from "../../Users/components/userCard";

interface useProps {
    user: user;
    removeFunc: Function;
    addFunc: Function;
    id: string;
    remove: boolean;
    roleName: string;
}

export default function(props: useProps) {

    const [disabled, setDisabled] = useState<boolean>(false)

    const submitFunc = () => {
        setDisabled(true)
        const body = useCrf()
        body.append("ID", props.id)
        body.append("username", props.user.username)
        body.append('name', props.roleName)
        body.append('action', props.remove? "remove": "add")
        fetch(data.host+"projects/settings/roles/users/handle", {
            method: "POST",
            body: body
        })
        .then(res => {
            if (res.status != 200) {
                setDisabled(false)
                return
            }
            props.removeFunc()
            props.addFunc()
        })
    }

    return  (
        <UserCardTemp user={props.user} func={submitFunc} disabled={disabled} remove={props.remove}/>
    ) 
            
}