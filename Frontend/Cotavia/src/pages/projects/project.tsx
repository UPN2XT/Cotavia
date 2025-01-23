import { useState, useEffect, KeyboardEvent, useRef, useContext } from "react"
import { useNavigate, useParams } from "react-router"
import useCrf from "../../hooks/useCrf"
import applicationData from "../../data"
import CodeEditor from "./components/codeEditor"
import DirectoryViewer from "./components/DirectoryViewer"
import { Folder } from "./components/DirectoryViewer"
import socketHandler from "./scripts/socketHandler"
import SideBar from "./components/SideBar"
import ContextMenu from "./components/contextMenu"
import { contextInfo } from "./components/contextMenu" 
import { projectContext, TransferInfo, InfoMenu } from "../../context/projectContext"
import RoleModifier from "./components/roleModifier"
import { permisionContext, permisions } from "../../context/permisionsContext"

export default function() {

    const [dictionary, setDictionary] = useState<Folder>(
        { 
            name: '', 
            folders: {}, 
            files: {}
        } 
    )
    const ref = useRef<HTMLDivElement | null>(null)
    const {id} = useParams()
    const [codeText, setCodeText] = useState<string>("")
    const [currentPath, setCurentPath] = useState<string>("")
    const [menuInfo, setMenuInfo] = useState<contextInfo>({
        x: 0, y: 0, toggle: false, children: <></>
    })
    const [upToDateData, setUpToDateData] = useState<string>("")
    const [showExplorer, setShowExplorer] = useState<boolean>(true)
    const [RoleMenu, setRoleMenu] = useState<InfoMenu>({
        path: "",
        toggle: false,
        type: ""
    })

    const [transferInfo, setTransferInfo] = useState<TransferInfo>({   from: "",
            to: "",
            type: "",
            copy: false
        })

    const [tabs, setTabs] = useState<string[]>([])
    const {canModifyFiles,setFunction} = useContext<permisions>(permisionContext)
    const [allowSave, setAllowSave] = useState<boolean>(true)

    const nav = useNavigate()

    const updateCode = async () => {
        const body = useCrf()
        body.append('ID', String(id))
        const res = await fetch(applicationData.host+"projects/getProject", {method: 'POST', body: body})
        if (res.status != 200) {
            nav("../")
            return
        } 
        const result = await res.json()
        setDictionary(result.filePath)
        socketHandler(setDictionary, currentPath, setUpToDateData, String(id), codeText, setTabs,
            RoleMenu, setRoleMenu, setFunction != undefined? setFunction:() => {}, nav)
    }

    const updateFile = async () => {
        const body = useCrf()
        body.append('ID', String(id))
        body.append('path', currentPath)
        body.append('data', codeText)
        fetch(applicationData.host+"projects/updateFile", {method: 'POST', body: body})
        .then(res => console.log(res.status))
    }


    useEffect(() => {
        updateCode()
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    const handler = (e: globalThis.MouseEvent) => {
        if (ref.current && e.target instanceof Node)
            if (!ref.current.contains(e.target))
                {
                    setMenuInfo(prev => ({...prev, toggle: false}))
                }
        }

    useEffect(() => {
        setUpToDateData("")
    }, [currentPath])

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    const saveEvent = (e: KeyboardEvent) => {
        if  ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault()
            if (allowSave && canModifyFiles){
                setAllowSave(false)
                if (currentPath != "")
                    updateFile()
                    .then(() => delay(250))
                    .then(() => setAllowSave(true))
            }
        }
    }
    
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
                data: codeText,
                setData: setCodeText,
                setPath: setCurentPath,
                MenuInfo: RoleMenu,
                setMenuInfo: setRoleMenu,
                offsetH: ref.current?.offsetHeight? ref.current?.offsetHeight: 0
            }
        }>
            <div className="flex h-screen w-screen"
            onKeyDown={saveEvent}>
                <ContextMenu x={menuInfo.x} y={menuInfo.y} toggle={menuInfo.toggle} children={menuInfo.children} ref={ref}/>
                <SideBar setFunction={setShowExplorer} explorerActive={showExplorer}/>
                <div className={"fixed ml-12 flex-shrink-0 z-40 h-screen p-2 flex gap-2 " + (showExplorer? "visible": "hidden")}>
                    <DirectoryViewer Dir={dictionary} />
                    {RoleMenu.toggle && <RoleModifier />}
                </div>
                    
                    <CodeEditor data={codeText} onChange={(value) => setCodeText(value? value: "")} path={currentPath} upToDateData={upToDateData}
                            setFunction={setCodeText} setFunction2={setUpToDateData} Tabs={tabs} setTabs={setTabs} root={dictionary} />
            </div>
        </projectContext.Provider>
        
    )
}