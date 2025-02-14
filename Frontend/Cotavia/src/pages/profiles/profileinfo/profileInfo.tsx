import { profileContext, profile } from "../../../context/profileContext"
import { useContext, useState } from "react"
import { PencilSquareIcon, UserCircleIcon } from "@heroicons/react/16/solid"
import useFileUpload from "../../../hooks/useFileUpload"
import data from "../../../data"
import useCrf from "../../../hooks/useCrf"

export default function() {
    const {pfp, Displayname, username, connections, setFunction} = useContext(profileContext)
    const [displayname, setDisplayname] = useState<string>(Displayname)

    const changePfp = async () => {
        const file = await useFileUpload('image')
        if ((file) == null) return
        const body = useCrf()
        body.append("pfp", file[0])
        const res = await fetch(data.host+"profiles/update/pfp", {method: "POST", body:body})
        if (res.status != 200) return
        const result = await res.json()
        const url = result.url
        setFunction((prev: profile) => ({...prev, pfp: url}))
    }


    const changeUsername = async () => {
        const body = useCrf()
        body.append("name", displayname)
        const res = await fetch(data.host+"profiles/update/displayname", {method:"POST", body:body})
        if (res.status != 200)
            return
        setFunction((prev: profile) => ({...prev, displayname: displayname}))
    }

    return (
        <div className="flex gap-8 max-w-full items-center flex-col md:flex-row md:justify-start">
            <div className="w-fit relative group max-w-full flex-shrink-0">
                <img src={pfp} alt="pfp" className="w-48 rounded-full relative"/>
                <div className="w-full h-full absolute inset-0 bg-black opacity-0 hover:opacity-50 hover:cursor-pointer
                    rounded-full flex justify-center items-center"
                    onClick={changePfp}>
                    <PencilSquareIcon  className="size-8"/>
                </div>
                
            </div>
            
            <div className="flex flex-col justify-center gap-1 items-center md:items-start">
                <div className="flex flex-col gap-4 items-center md:hover:border-b-2 md:border-white md:focus:border-b-2 md:flex-row">
                    <input value={displayname} className="bg-transparent w-80 text-5xl font-extrabold peer focus:outline-none
                        text-center md:text-start border-none"
                        onChange={e => setDisplayname(e.target.value)}/>
                    <button className="opacity-0 peer-focus:opacity-100"
                        onClick={changeUsername}>
                        Save
                    </button>
                </div>
                <div className="flex gap-4 md:flex-col pl-1 text-3xl md:text-xl md:gap-1">
                    <h3 className="font-semibold">
                        @{username}
                    </h3>
                    <text className="font-medium hover:cursor-default flex items-center gap-1">
                        <UserCircleIcon className="size-6 md:size-4"/> {connections}
                    </text>
                </div>
                
            </div>
        </div>
    )
}