import { profileContext } from "../../../context/profileContext"
import { useContext } from "react"

export default function() {
    const {pfp, Displayname, username} = useContext(profileContext)

    return (
        <div className="flex gap-8">
            <img src={pfp} alt="pfp" className="w-48 rounded-full"/>
            <div className="flex flex-col justify-center gap-1">
                <h2 className="text-5xl font-extrabold">
                    {Displayname}
                </h2>
                <div className="flex gap-1 items-center">
                    <h3 className="text-xl font-semibold">
                        @{username}
                    </h3>
                    <text className="font-medium underline hover:cursor-default">
                        10 Connections
                    </text>
                </div>
                
            </div>
        </div>
    )
}