import { useContext } from "react"
import { profileContext } from "../context/profileContext"
import { Link } from "react-router"
export default function() {

   const {pfp, Displayname} = useContext(profileContext)

    return (
        <nav className="p-4 flex-grow-0 h-12 flex justify-between">
            <Link to="">
                <h1 className="text-xl font-semibold">
                    Cotavia build C
                </h1>
            </Link>
            <div className="flex items-center gap-4 p-4">
                <h2 className="text-xl font-semibold">{Displayname}</h2>
                <Link to="profiles">
                    <img src={pfp} className="h-12 w-12 rounded-full"/>
                </Link>
            </div>
        </nav>
    )
}