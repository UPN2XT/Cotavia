import BorderRoundedCard from "../../../components/general components/cards/BorderRoundedCard";
import useCrf from "../../../hooks/useCrf";
import data from "../../../data";
import { useState } from "react";
import getIncomingRequests from "../scripts/ConnectionsListHandler";

interface userProps {
    username:string;
    displayname: string;
    pfp: string;
    setFunction: Function;
    mode: string;
}

export default function(props: userProps) {

    const [isActive, setIsActive] = useState<boolean>(true)

    const accept = (accept: boolean) => {
        setIsActive(false)
        const body = useCrf()
        body.append("username", props.username)
        body.append("accept", accept? "T": "F")
        body.append("mode", props.mode)
        fetch(data.host+"profiles/req/handle", {method: 'POST', body:body})
        .then(() => getIncomingRequests(props.setFunction, props.mode))
        .then(c => props.setFunction(c))
    }
        

    return (
        <BorderRoundedCard classes="w-40 flex flex-col items-center p-2">
            <img src={props.pfp} className="h-16 rounded-full"/>
                <text className="text-center font-bold text-xl">
                    {props.displayname}
                </text>
            <text className="text-center">
                {props.username}    
            </text>
            <div className="flex gap-2">
                <button className="border-2 p-2 border-black rounded-md" disabled={!isActive} onClick={()=>accept(true)}>
                    {props.mode == "i"? "Connect": props.mode == "o"? "Cancel": "Remove"}
                </button>
                {
                    props.mode == 'i' && <button className="border-2 p-2 border-black rounded-md" disabled={!isActive} onClick={()=>accept(false)}>
                        X
                    </button>
                }
            </div>
        </BorderRoundedCard>
    )
}