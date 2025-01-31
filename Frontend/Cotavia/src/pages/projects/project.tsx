import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router"
import useCrf from "../../hooks/useCrf"
import applicationData from "../../data"
import CodeEditor from "./components/codeEditor"
import DirectoryViewer, { FileContainer } from "./components/DirectoryViewer"
import { Folder } from "./components/DirectoryViewer"
import SocketHandler from "./scripts/SocketEvents/socketHandler"
import SideBar from "./components/SideBar"
import ContextMenu, { contextInfo } from "./components/contextMenu"
import { projectContext, project, codeTextInterface } from "../../context/projectContext"
import RoleModifier from "./components/roleModifier"
import { permisionContext, permisions } from "../../context/permisionsContext"
import LinkManagePannel from "../Link/components/LinkManagePannel"
import { LinkContext, LinkData } from "../../context/LinkContext"
import pathChange from "./scripts/projectManger/pathChange"
import saveFile from "./scripts/projectManger/saveFile"
import getFileFromServer from "../Link/scripts/getFile"
import updateTextCode from "./scripts/projectManger/updateTextCode"
import { getFile } from "./scripts/Updater"

export default function() {

    const [dictionary, setDictionary] = useState<Folder>(
        { 
            name: '', 
            folders: {}, 
            files: {}
        } 
    )
    const {currentPath, ref, setContextInfo, codeText, setCodeText, 
        contextInfo, MenuInfo, setMenuInfo } = useContext<project>(projectContext)
    const {id} = useParams()
    const [upToDateData, setUpToDateData] = useState<boolean>(true)
    const [sideTabIndex, setSideTabIndex] = useState<number>(-1)

    const [tabs, setTabs] = useState<string[]>([])
    const {canModifyFiles,setFunction} = useContext<permisions>(permisionContext)
    const [allowSave, setAllowSave] = useState<boolean>(true)
    const [chache, setChache] = useState<{[path: string]: {
        data: string,
        file: FileContainer
    }}>({})
    const {socket, setLinkDirectory, LiveUpdate, LinkDirectory} = useContext<LinkData>(LinkContext)
    const [enableSocket, setEnableSocket] = useState<boolean>(false)

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
        setEnableSocket(true)
    }

    const UpdateFunction = async (file: FileContainer | null = getFile(dictionary, currentPath)) => {
        if (file == null) return
        let result = await getFileFromServer(currentPath, String(id))

        updateTextCode(setCodeText, currentPath, socket, String(id), setChache, file, result, true)
    }

    useEffect(() => {
        try {
            updateCode()
        }
        catch {
            if (applicationData.devaloperMode)
                setDictionary({
                    name: "root", 
                    files: {},
                    folders: {}
                })
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    const handler = (e: globalThis.MouseEvent) => {
        if (ref == undefined) return
        if (ref.current && e.target instanceof Node)
            if (!ref.current.contains(e.target))
                {
                    setContextInfo((prev: contextInfo) => ({...prev, toggle: false}))
                }
        }

    useEffect(() => {
        pathChange(setCodeText, currentPath, dictionary, setUpToDateData, chache, socket, String(id), UpdateFunction, LinkDirectory)
    }, [currentPath])
    
    useEffect(() => {
        console.log(LinkDirectory)
    }, [LinkDirectory])

    const setVisiblity = (x:number) => "fixed flex-shrink-0 z-40 h-screen p-2 flex gap-2 " + (sideTabIndex == x? "visible": "hidden")
    
    return (
        <div className="flex h-screen w-screen"
            onKeyDown={(e: React.KeyboardEvent) => saveFile(e, allowSave, setAllowSave, String(id), currentPath, canModifyFiles, codeText)}>
            { enableSocket && <SocketHandler 
                setDictionary={setDictionary} 
                currentPath={currentPath} 
                setUpToDateData={setUpToDateData} 
                id={String(id)} 
                codeText={codeText.data} 
                setTabs={setTabs} 
                RoleMenu={MenuInfo} 
                setRoleMenu={setMenuInfo} 
                permisonUpdateFunction={setFunction != undefined ? setFunction : () => {}} 
                nav={nav} 
                LinkSocket={socket} 
                LiveUpdate={LiveUpdate} 
                setLinkDirectory={setLinkDirectory} 
            />}
            <ContextMenu x={contextInfo.x} y={contextInfo.y} toggle={contextInfo.toggle} children={contextInfo.children} ref={ref}/>
            <SideBar setFunction={setSideTabIndex} sideTabIndex={sideTabIndex} socket={socket}/>
            <div>
                <div className={setVisiblity(0)}>
                    <DirectoryViewer Dir={dictionary} />
                    {MenuInfo.toggle && <RoleModifier />}
                </div>
                <div className={setVisiblity(1)}>
                    <LinkManagePannel dir={dictionary}
                        setChache={setChache}/>
                </div>
            </div>   
                <CodeEditor data={codeText} onChange={(value) => setCodeText((prev: codeTextInterface) => ({...prev, data: value? value: ""}))} path={currentPath} upToDateData={!upToDateData}
                 setUpToDateData={setUpToDateData} Tabs={tabs} setTabs={setTabs} root={dictionary} updateFunction={UpdateFunction}/>
            </div>
         
    )
}