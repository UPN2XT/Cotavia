import { permisionContext, permisions } from "../../context/permisionsContext";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useCrf from "../../hooks/useCrf";
import data from "../../data";
import LinkProvider from "../Link/components/LinkProvider";
import ProjectDataProvider from "./projectDataProvider";

export default function() {

    const [perm, setPerm] = useState<permisions>({
        isAdmin: true,
        canCreate: true,
        canDelete: true,
        canModifyFiles: true,
    })

    const [loaded, setLoaded] = useState<boolean>(data.devaloperMode? true: false)
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
        try {
            loadPerm()
            .then(() => setLoaded(true))
        }
        catch {
            if (data.devaloperMode)
                setLoaded(true)
        }
        
    }, [])
    return (
        
            <permisionContext.Provider value={{
                ...perm,
                setFunction: loadPerm
            }}>
                <LinkProvider>
                    <ProjectDataProvider>
                        <div className={loaded? "visible": "hidden"}>
                            <Outlet />
                        </div>
                    </ProjectDataProvider>
                </LinkProvider>
            </permisionContext.Provider>
       
    )
}