import applicationData from "../../../../data";
import { InfoMenu } from "../../../../context/projectContext";
import { useEffect, useState } from "react";
import onMessageHandler from "./onMessageHandler";


interface useProps {
    setDictionary: Function, currentPath: string, setUpToDateData: Function, id: string, codeText: string, setTabs: Function,
    RoleMenu: InfoMenu, setRoleMenu: Function, permisonUpdateFunction: Function, nav: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean,
    setLinkDirectory: Function
}

const socketHandler = ({setDictionary, currentPath, setUpToDateData, id, codeText, setTabs,
    RoleMenu, setRoleMenu, permisonUpdateFunction, nav, LinkSocket, LiveUpdate,
    setLinkDirectory} : useProps) => {
    
    
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {

        const s = new WebSocket(`${applicationData.WsHost}ws/projects/update/${id}/`);
        s.onopen = function() {
            setSocket(s)
        }

        s.onclose = () => setSocket(null)

        return () => s.close()
        
        }, [])

        useEffect(() => {
            if (socket)
                socket.onmessage = event => onMessageHandler(setDictionary, currentPath, setUpToDateData, 
                    id, codeText, setTabs, RoleMenu, setRoleMenu, permisonUpdateFunction, nav, LinkSocket, 
                    LiveUpdate, setLinkDirectory, event
                )
        }, [LiveUpdate, socket])

        return (
            <></>
        )
    }

export default socketHandler