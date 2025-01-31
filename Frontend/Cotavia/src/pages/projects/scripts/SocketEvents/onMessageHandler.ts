import { InfoMenu } from "../../../../context/projectContext";
import mkDir from "./mkDir";
import updateFile from "./updateFile";
import deleteEvent from "./deleteEvent";
import moveEvent from "./moveEvent";

export default function (
    setDictionary: Function, currentPath: string, setUpToDateData: Function, id: string, codeText: string, setTabs: Function,
        RoleMenu: InfoMenu, setRoleMenu: Function, permisonUpdateFunction: Function, nav: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean,
        setLinkDirectory: Function, event: MessageEvent<any>
) {

    const data = JSON.parse(event.data)

    if (data["event"] == "delete/User") {
        nav("../")
        return
    }

    if (data["event"] == "role/change/reload") {
        permisonUpdateFunction()
        return
    }

    if (data["event"] == "create/folder") {
        mkDir(setDictionary, LinkSocket, LiveUpdate, setDictionary, data, id)
        return
    }

    if (data["event"] == "update/file") {
        updateFile(setDictionary, currentPath, setUpToDateData, id, codeText, LiveUpdate,
                setLinkDirectory, LinkSocket, data
        )
        return
    }
    
    const parms = String(data["event"]).split("/")
    
    if (parms[0] == "delete") {
        deleteEvent(setDictionary, id, setTabs, setLinkDirectory, data, RoleMenu, setRoleMenu,
            LinkSocket,LiveUpdate, parms[1]
        )
        return
    }
    
    moveEvent(setDictionary, id, setTabs, RoleMenu, setRoleMenu, LinkSocket, LiveUpdate,
            setLinkDirectory, parms, data
    )
}