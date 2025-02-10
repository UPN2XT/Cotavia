import React, { useState, useRef } from "react"
import { contextInfo } from "./components/contextMenu" 
import { projectContext, TransferInfo, InfoMenu, UUIDPATHS } from "../../context/projectContext"
import { codeTextInterface } from "../../context/projectContext"

export default function({children}: {children: React.ReactNode}) {

    const ref = useRef<HTMLDivElement | null>(null)
    const [codeText, setCodeText] = useState<codeTextInterface>({
        data: "",
        type: "",
        UUID: ""
    })
    const [currentPath, setCurentPath] = useState<string>("")
    const [menuInfo, setMenuInfo] = useState<contextInfo>({
        x: 0, y: 0, toggle: false, children: <></>
    })
    const [RoleMenu, setRoleMenu] = useState<InfoMenu>({
        path: "",
        toggle: false,
        type: "",
        UUID: ""
    })

    const [transferInfo, setTransferInfo] = useState<TransferInfo>({   
            from: "",
            to: "",
            type: "",
            copy: false,
            FromUUID: ""
        })

    const [UUIDPaths, setUUIDPaths] = useState<UUIDPATHS>({folders: {}, files: {}})

    return (
        <projectContext.Provider value={
            {
                isAdmin: true,
                currentPath: currentPath,
                ref: ref,
                setContextInfo: setMenuInfo,
                setCurrentPath: setCurentPath,
                contextInfo: menuInfo,
                transferInfo: transferInfo,
                setTransferInfo: setTransferInfo,
                data: codeText.data,
                setData: setCodeText,
                setPath: setCurentPath,
                MenuInfo: RoleMenu,
                setMenuInfo: setRoleMenu,
                offsetH: ref.current?.offsetHeight? ref.current?.offsetHeight: 0,
                codeText: codeText,
                setCodeText: setCodeText,
                UUIDPaths: UUIDPaths,
                UUIDPathsUpdate: setUUIDPaths
            }
        }>
            {children}
        </projectContext.Provider>
    )
}