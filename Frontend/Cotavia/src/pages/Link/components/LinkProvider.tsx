import { LinkContext } from "../../../context/LinkContext"
import { useState } from "react"
import { Folder } from "../../projects/components/DirectoryViewer"

export default function({children}: {children: React.ReactNode}) {

    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [LiveUpdate, setLiveUpdate] = useState<boolean>(false)
    const [LinkDirectory, setLinkDirectory] = useState<Folder | null>(null)
    return (
        <LinkContext.Provider value={{socket, setSocket, LiveUpdate, 
            setLiveUpdate, LinkDirectory, setLinkDirectory
        }}>
            {children}
        </LinkContext.Provider>
    )
}