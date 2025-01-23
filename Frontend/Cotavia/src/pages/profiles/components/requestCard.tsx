import BorderRoundedCard from "../../../components/general components/cards/BorderRoundedCard";
import useCrf from "../../../hooks/useCrf";
import data from "../../../data";
import { useState } from "react";
import getIncomingRequests from "../scripts/ConnectionsListHandler";
import { XMarkIcon } from "@heroicons/react/16/solid";

interface userProps {
    username:string;
    displayname: string;
    pfp: string;
    setFunction: Function;
    mode: string;
    updatable: boolean
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
        .then(() => {
            if (!props.updatable)
                getIncomingRequests(props.setFunction, props.mode)
                .then(c => props.setFunction(c))
            else {
                props.setFunction()
            }
        })
        
    }
        

    return (
        <BorderRoundedCard classes="min-w-72 flex items-center p-6 gap-2 w-fit">
            <img src={props.pfp} className="size-24 rounded-full"/>
                
            <div className="flex flex-col gap-2 w-48 overflow-clip">
                <div className="flex text-xl flex-col items-end pr-2">
                    <h3 className="text-center font-bold text-4xl text-clip">
                        {props.displayname}
                    </h3>
                    <h3 className="text-center text-pretty self-end">
                        @{props.username}    
                    </h3>
                </div>
                {props.mode != "x" && (
                <div className="flex gap-2 justify-end">
                    <button className={"p-2 rounded-md " + (props.mode == "c" || props.mode == "o"? "bg-red-500": "bg-green-500")} disabled={!isActive} onClick={()=>accept(true)}>
                        {props.mode == "c"? "Remove": props.mode == "o" ? "Cancel": props.mode == "s"? "Send": "Add"}
                    </button>
                    {
                        props.mode == 'i' && <button className="bg-red-500 p-2 rounded-md" disabled={!isActive} onClick={()=>accept(false)}>
                            <XMarkIcon className="size-5"/>
                        </button>
                    }
                </div>
                )}
                
            </div>
            
        </BorderRoundedCard>
    )
}