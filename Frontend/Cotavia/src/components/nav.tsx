import { useContext, useState } from "react"
import { profileContext } from "../context/profileContext"
import { Link } from "react-router"
import { UserCircleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid"
import data from "../data"
export default function() {

   const {pfp, Displayname} = useContext(profileContext)
    const [show, setShow] = useState<boolean>(false)

    const logout = () => {
        fetch(data.host+"api/auth/logout")
        .then(() => location.reload())
    }

    return (
        <>
            <nav className="p-4 flex-grow-0 h-12 flex justify-between backdrop-blur-sm w-screen">
                <Link to="">
                    <h1 className="text-xl font-semibold">
                        Codavia Alpha
                    </h1>
                </Link>
                {pfp != "" && (
                    <div className="flex items-center gap-4 p-4 z-50">
                        <h2 className="text-xl font-semibold">{Displayname}</h2>
                        <img src={pfp} className="h-12 w-12 rounded-full hover:cursor-pointer" onClick={() => setShow(s => !s)}/>
                    </div>
                )}
            </nav>
            {show && (
                    <div className="fixed flex w-full justify-end">
                        <menu className="w-40 bg-neutral-700 backdrop-blur-xl bg-opacity-30 h-min mr-14 mt-3 p-2 rounded-xl rounded-tr-none z-50">
                            <Link className="px-4 py-2 flex gap-4 hover:bg-white hover:bg-opacity-5 rounded-xl mb-2"
                                to="profiles">
                                <UserCircleIcon className="size-6"/>Account
                            </Link>
                            <button className="px-4 py-2 flex gap-4 hover:bg-white hover:bg-opacity-5 rounded-xl"
                                onClick={logout}>
                                <ArrowLeftStartOnRectangleIcon className="size-6"/>Logout
                            </button>
                        </menu>
                    </div>
            )}
        </>
    )
}