import { DocumentDuplicateIcon, Cog6ToothIcon, HomeIcon } from "@heroicons/react/16/solid"
import { Link } from "react-router"
interface useProps {
    setFunction: Function
    explorerActive: boolean
}

export default function(props: useProps) {
    return (
        <div className="border-r-2 border-neutral-950 p-2 pt-5 pb-5 flex flex-col justify-between hover:cursor-pointer">
            <DocumentDuplicateIcon className={"size-8 " + (props.explorerActive?"border-l-2 border-purple-500":"")}
                onClick={() => props.setFunction((s: boolean) => !s)}/>
            <div className="flex flex-col gap-2">
                <Link to="settings">
                    <Cog6ToothIcon className="size-8 hover:-rotate-45"/>
                </Link>
                <Link to="../">
                    <HomeIcon className="size-8" />
                </Link>
            </div>
        </div>
    )
}