import { useContext, useState } from "react"
import { project, projectContext } from "../../../context/projectContext"
import { contextInfo } from "./contextMenu"
import CreateField from "./createField"
import useCrf from "../../../hooks/useCrf"
import data from "../../../data"
import { permisionContext, permisions } from "../../../context/permisionsContext"
import getFile from "../../Link/scripts/getFile"
import { MapPinIcon, ScissorsIcon, ClipboardDocumentIcon, TrashIcon, CircleStackIcon, ArrowDownCircleIcon, PencilSquareIcon,
    ArchiveBoxArrowDownIcon
 } from "@heroicons/react/16/solid"

export default function({path, file, id, UUID}: {path: string, file: boolean, id: string, UUID: string}) {

    const {setContextInfo, setTransferInfo, transferInfo, setMenuInfo} = useContext<project>(projectContext)
    const {canModifyFiles, canCreate, canDelete, isAdmin} = useContext<permisions>(permisionContext)
    const [nameVal, setNameVal] = useState<string>("")

    const toggleOff = () => {
        setContextInfo((prev: contextInfo) => ({...prev, toggle: false}))
    }

    const showRoleMenu = () => {
        toggleOff()
        setMenuInfo({ path: path, toggle: true, type: file? "file": "folder", UUID: UUID})
    }
    
    const move = (cut: boolean) => {
        toggleOff()
        setTransferInfo({from: path, type:file?"file":"folder", copy:!cut, to:"", FromUUID: UUID})
    }

    const rename = () => {
        toggleOff()
        const body = useCrf()
        body.append('ID', id)
        body.append('UUID', UUID)
        body.append('name', nameVal)
        body.append('Type', file? 'file': 'folder')
        fetch(data.host+'projects/filemanger/rename', {method: 'POST', body: body})
    }

    const paste = async () => {
        toggleOff()
        const body = useCrf()
        body.append("ID", id)
        body.append("Type", transferInfo.type)
        body.append("mode", transferInfo.copy? "copy": "cut")
        body.append("UUIDFrom", transferInfo.FromUUID)
        body.append("UUIDTo", UUID)
        setTransferInfo({from: "", type:file?"file":"folder", copy:false, to:""})
        fetch(data.host+`projects/filemanger/move`,
            {
                method: "POST", body: body
            }
        )
    }

    const Delete = async () => {
        toggleOff()
        const body = useCrf()
        body.append("ID", id)
        body.append("Type", file?"file":"folder")
        body.append("UUID", UUID)
        await fetch(data.host+`projects/filemanger/delete`, {
            method: "POST", body: body
        })
    }

    const downloadFile = async () => {
        const f = await getFile(UUID, id)
        if (f == null) return
        const url = window.URL.createObjectURL(f)
        const a = document.createElement("a")
        a.href = url
        const name = path.split("/")
        a.download = name[name.length - 1]
        document.body.appendChild(a)
        a.click()
        document.removeChild(a)
        window.URL.revokeObjectURL(url)
    }
    

    return (
        <>
             <input value={nameVal} className="bg-inherit bg-opacity-25 w-full rounded-mdplaceholder:text-sm text-sm p-1
                focus:outline-none rounded-md pl-2" placeholder=". . ."
                onChange={e => setNameVal(e.currentTarget.value)}/>
            {!file && (
                <>
                {canCreate && <CreateField id={id} rootRef={path} toggleFunction={toggleOff} UUID={UUID} nameVal={nameVal}/>}
                {
                    transferInfo.from != "" && transferInfo.from != path && canModifyFiles && (
                        <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2  flex gap-4 items-center"
                            onClick={paste}>
                            <ArchiveBoxArrowDownIcon className="size-5"/> Paste
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
                                <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={() => {
                                   rename()
                                }}
                                    disabled={nameVal==""}>
                                    <PencilSquareIcon className="size-5"/> Rename
                                </button>

                                <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={() => {
                                    move(true)
                                }}>
                                    <ScissorsIcon className="size-5"/> Cut
                                </button>
                                <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={() => {
                                    move(false)
                                }}>
                                    <ClipboardDocumentIcon className="size-5"/>
                                    Copy
                                </button>
                            </>
                        )
                    }

                    {
                        canDelete && (
                            <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={Delete}>
                                <TrashIcon className="size-5"/>
                                Delete
                            </button>
                        )
                    }

                    {
                        file && (
                            <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={downloadFile}>
                                <ArrowDownCircleIcon className="size-5" />
                                Download
                            </button>
                        )
                    }
                    
                    {
                        isAdmin && (
                            <button className="w-full text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex gap-4 items-center" onClick={showRoleMenu}>
                                <CircleStackIcon className="size-5" />
                                Edit Roles
                             </button>
                        )
                    }
                    </>
                    )}
            <div className="w-full overflow-x-clip flex gap-1 items-center border-t-white border-t-[0.25px] pt-4">
                <MapPinIcon className="size-5"/>{path===""? "/root": path.replace("/", ">")}
            </div>
        </>
    )
}