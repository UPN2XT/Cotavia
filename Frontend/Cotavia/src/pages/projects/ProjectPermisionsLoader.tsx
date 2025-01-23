import { permisionContext, permisions } from "../../context/permisionsContext";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useCrf from "../../hooks/useCrf";
import data from "../../data";

export default function() {

    const [perm, setPerm] = useState<permisions>({
        isAdmin: false,
        canCreate: false,
        canDelete: false,
        canModifyFiles: false,
    })

    const [loaded, setLoaded] = useState<boolean>(false)
    const {id} = useParams()

    const loadPerm = async () => {
        const body = useCrf()
        body.append("ID", String(id))
        const res = await fetch(data.host+"projects/permisions", {method:"POST", body:body})
        if (res.status != 200)
            return
        const result = await res.json()
        setPerm({
            ...result,
            setFunction: loadPerm
        })
    }

    useEffect(() => {
        loadPerm()
        .then(() => setLoaded(true))
    }, [])
    return (
        <permisionContext.Provider value={{
            ...perm,
            setFunction: loadPerm
        }}>
            <div className={loaded? "visible": "hidden"}>
                <Outlet />
            </div>
        </permisionContext.Provider>
    )
}