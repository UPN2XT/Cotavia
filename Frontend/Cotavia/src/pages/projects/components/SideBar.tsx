import { DocumentDuplicateIcon, Cog6ToothIcon, HomeIcon, LinkIcon, CommandLineIcon } from "@heroicons/react/16/solid"
import { Link } from "react-router"
import { useParams } from "react-router"
interface useProps {
    setFunction: Function
    sideTabIndex: number
    socket: WebSocket | null
}

export default function(props: useProps) {

    const setSidePannelUpdate = (x: number) => {
        if (props.sideTabIndex == x)
            props.setFunction(-1)
        else
            props.setFunction(x)
    }

    const {id} = useParams()

    const openCMD = () => {
        props.socket?.send(JSON.stringify({
            event: "open/terminal",
            data: {
                ID: id,
                path: ""
            }
        }))
    }

    const setActive = (x: number) => ("size-9 " + 
            (props.sideTabIndex == x?"border-l-2 " + (x==0?"border-purple-500": "border-purple-500"):"border-blue-500"))

    return (
        <div className="border-r-2 border-neutral-950 p-2 pt-5 pb-5 flex flex-col justify-between hover:cursor-pointer">
            <div className="flex flex-col gap-4">
                <DocumentDuplicateIcon className={setActive(0)}
                    onClick={() => setSidePannelUpdate(0)}/>
                <LinkIcon className={setActive(1)}
                     onClick={() => setSidePannelUpdate(1)}/>
                {props.socket != null && <CommandLineIcon className={setActive(2)}
                     onClick={() => {setSidePannelUpdate(2); openCMD()}}/>}
            </div>
            
            <div className="flex flex-col gap-4">
                <Link to="settings">
                    <Cog6ToothIcon className="size-9 hover:-rotate-45"/>
                </Link>
                <Link to="../">
                    <HomeIcon className="size-9" />
                </Link>
            </div>
        </div>
    )
}