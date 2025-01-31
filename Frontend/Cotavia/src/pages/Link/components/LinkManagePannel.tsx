import { LinkIcon, LinkSlashIcon } from "@heroicons/react/16/solid"
import { LinkContext, LinkData } from "../../../context/LinkContext"
import { useContext, useState, useEffect } from "react"
import LinkSocket from "../scripts/LinkSocket"
import { useParams } from "react-router"
import loadProjectToLink from "../scripts/loadProjectToLink"
import { Folder } from "../../projects/components/DirectoryViewer"
import LinkCacheHandler from "../scripts/LinkCacheHandler"
import { project, projectContext } from "../../../context/projectContext"

interface useProps {
    dir: Folder
    setChache: Function
}

export default function({dir, setChache}: useProps) {

    const [port, setPort] = useState<string>("")
    const {socket, setSocket, LinkDirectory, setLinkDirectory, setLiveUpdate, LiveUpdate} = useContext<LinkData>(LinkContext)
    const {id} = useParams()
    const [firstLoad, setFirstLoad] = useState<boolean>(true)
    const {currentPath, setCodeText} = useContext<project>(projectContext)

    useEffect(() => {
        if (LinkDirectory == null)
            return
        !firstLoad && (() =>{socket?.send(JSON.stringify({
                event: "updatePaths",
                data: {
                    ID: String(id),
                    paths: LinkDirectory
                } 
            }))
        })()
        setFirstLoad(false)
    }, [LinkDirectory])


    const onMessage = (e: MessageEvent<any>, s: WebSocket) => {
        const data = JSON.parse(e.data)
        if (data.event == "projectResult") {
            if (data.project == null) 
                s.send(JSON.stringify({event: "createProject", data: {ID:id, name: dir.name}}))
            else {
                setSocket(s)
                setLinkDirectory(data.project.paths)
            }
                
        }
        if (data.event == "projectCreation"){
            setSocket(s)
        }

        if (data.event == "get/file") {
            const lk = LinkDirectory
            console.log(lk)
            if (lk == null) return
            LinkCacheHandler(data.data, currentPath, lk, dir, setCodeText,
                String(id), setChache, data["status"] == "success")
        }
    }

    if (socket != null)
        socket.onmessage = (e) => onMessage(e, socket)

    const LunchLink = () => {
        if (socket) {
            socket.close()
            return
        }

        const s = LinkSocket(port)
        s.onopen = (e) => {
            console.log(e.timeStamp)
            
            s.send(JSON.stringify({event: "getProject", data: {ID:id}}))
            s.onmessage = e => onMessage(e, s)
        }

        s.onclose = () => {setSocket(null); setFirstLoad(false)}
        
    }

    return (
        <div className=" h-full w-max bg-neutral-800 rounded-md shadow-sm shadow-neutral-950 p-4 min-w-60 overflow-x-scroll scroll overflow-y-scroll">
            <div className="flex flex-col gap-2 border-l-2 border-blue-500 min-h-full">
                <div className="mb-2 text-xl font-semibold border-b-2 border-blue-500 pb-1 pl-2">
                    Link
                </div>
                <div className="flex">
                    <input type="number"
                        className="bg-inherit focus:outline-none border-blue-500 border-b-2 p-2
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none border-r-2 border-t-2 rounded-r-md" 
                        placeholder="Link Port" value={port} onChange={e => setPort(e.target.value)}/>
                    <button className="pl-2" onClick={LunchLink}>
                        {
                            socket == null? <LinkIcon className="size-6" />: <LinkSlashIcon className="size-6" />
                        }
                    </button>
                </div>
                {socket != null && (<><button className="flex border-blue-500 border-b-2 border-r-2 border-t-2 mt-2 p-2 rounded-r-md hover:bg-blue-500 hover:text-neutral-800"
                    onClick={() => {
                        loadProjectToLink(dir, LinkDirectory, "", socket, String(id)); 
                        setLinkDirectory(dir)
                    }}>
                    Update Project
                </button>
                <button className={"flex border-blue-500 border-b-2 border-r-2 border-t-2 mt-2 p-2 rounded-r-md " + (LiveUpdate?"bg-blue-500 text-neutral-800 hover:bg-transparent hover:text-white": "hover:bg-blue-500 hover:text-neutral-800")}
                    onClick={() => setLiveUpdate((prev: boolean) => !prev)}>
                    Live download
                </button></>)}
            </div>
        </div>
    )
}