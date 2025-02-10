import { InfoMenu, UUIDPATHS } from "../../../../context/projectContext";
import mkDir from "./mkDir";
import updateFile from "./updateFile";
import deleteEvent from "./deleteEvent";
import moveEvent from "./moveEvent";
import renameEvent from "./renameEvent";

export default function (
    setDictionary: Function, currentPath: string, setUpToDateData: Function, id: string, codeText: string, setTabs: Function,
        RoleMenu: InfoMenu, setRoleMenu: Function, permisonUpdateFunction: Function, nav: Function, LinkSocket: WebSocket | null, LiveUpdate: boolean,
        setLinkDirectory: Function, event: MessageEvent<any>, UUIDPathsUpdate: Function, UUIDLIST: UUIDPATHS
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
        data['path'] = UUIDLIST.folders[data['pUUID']]
        mkDir(setDictionary, LinkSocket, LiveUpdate, setDictionary, data, id, UUIDPathsUpdate)
        return
    }

    if (data["event"] == "update/file") {
        data['path'] = UUIDLIST.folders[data['pUUID']]
        updateFile(setDictionary, currentPath, setUpToDateData, id, codeText, LiveUpdate,
                setLinkDirectory, LinkSocket, data, UUIDPathsUpdate
        )
        return
    }
    
    const parms = String(data["event"]).split("/")
    
    if (parms[0] == "delete") {
        if (parms[1] == 'file')
            data['path'] = UUIDLIST.files[data['pUUID']]
        else
            data['path'] = UUIDLIST.folders[data['pUUID']].slice(0, -1)
        deleteEvent(setDictionary, id, setTabs, setLinkDirectory, data, RoleMenu, setRoleMenu,
            LinkSocket,LiveUpdate, parms[1]
        )
        return
    }

    if (parms[0] == "rename") {
            if (parms[1] == 'file')
                data['path'] = UUIDLIST.files[data['UUID']]
            else
                data['path'] = UUIDLIST.folders[data['UUID']].slice(0, -1)
            renameEvent(setDictionary, id, setTabs, setLinkDirectory, data, RoleMenu, setRoleMenu,
            LinkSocket,LiveUpdate, parms[1], UUIDPathsUpdate
        )
        return
    }

    if (parms[1] == 'file')
        data['from'] = UUIDLIST.files[data['pUUID2']]
    else
        data['from'] = UUIDLIST.folders[data['pUUID2']].slice(0, -1)

    data['to'] =  UUIDLIST.folders[data['pUUID']]
    
    
    moveEvent(setDictionary, id, setTabs, RoleMenu, setRoleMenu, LinkSocket, LiveUpdate,
            setLinkDirectory, parms, data, UUIDPathsUpdate
    )
}