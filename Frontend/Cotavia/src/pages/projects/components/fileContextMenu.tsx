import { useContext } from "react"
import { project, projectContext } from "../../../context/projectContext"
import { contextInfo } from "./contextMenu"
import CreateField from "./createField"
import useCrf from "../../../hooks/useCrf"
import data from "../../../data"
import { permisionContext, permisions } from "../../../context/permisionsContext"


export default function({path, file, id}: {path: string, file: boolean, id: string}) {

    const {setContextInfo, setTransferInfo, transferInfo, setMenuInfo} = useContext<project>(projectContext)
    const {canModifyFiles, canCreate, canDelete, isAdmin} = useContext<permisions>(permisionContext)

    const toggleOff = () => {
        setContextInfo((prev: contextInfo) => ({...prev, toggle: false}))
    }

    const showRoleMenu = () => {
        toggleOff()
        setMenuInfo({ path: path, toggle: true, type: file? "file": "folder"})
    }
    
    const move = (cut: boolean) => {
        toggleOff()
        setTransferInfo({from: path, type:file?"file":"folder", copy:!cut, to:""})
    }

    const paste = async () => {
        toggleOff()
        const body = useCrf()
        body.append("ID", id)
        body.append("From", transferInfo.from)
        body.append("To", path)
        body.append("type", transferInfo.type)
        setTransferInfo({from: "", type:file?"file":"folder", copy:false, to:""})
        fetch(data.host+`projects/filemanger/${transferInfo.copy? "copy": "cut"}`,
            {
                method: "POST", body: body
            }
        )
    }

    const Delete = async () => {
        toggleOff()
        const body = useCrf()
        body.append("ID", id)
        body.append("path", path)
        body.append("type", file?"file":"folder")
        const res = await fetch(data.host+`projects/filemanger/delete`, {
            method: "POST", body: body
        })
        console.log(res.body)
    }
    

    return (
        <>
            {!file && (
                <>
                {canCreate && <CreateField id={id} rootRef={path} toggleFunction={toggleOff}/>}
                {
                    transferInfo.from != "" && transferInfo.from != path && canModifyFiles && (
                        <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2"
                            onClick={paste}>
                            Paste
                        </button>
                    )
                }
                </>
            )}
            {path != "" && (
                <>
                    {
                        canModifyFiles && (
                            <>
                                <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2" onClick={() => {
                                    move(true)
                                }}>
                                    Cut
                                </button>
                                <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2" onClick={() => {
                                    move(false)
                                }}>
                                    Copy
                                </button>
                            </>
                        )
                    }

                    {
                        canDelete && (
                            <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2" onClick={Delete}>
                                Delete
                            </button>
                        )
                    }
                    
                    {
                        isAdmin && (
                            <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2" onClick={showRoleMenu}>
                                Edit Roles
                             </button>
                        )
                    }

                    </>
                    )}
            
        </>
    )
}