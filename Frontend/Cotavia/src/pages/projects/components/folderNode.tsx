import PathNode from "./pathNode"
import { Folder } from "./DirectoryViewer"
import { ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/16/solid";

interface useProps {
    root: Folder;
    path: String;
    subFolders: ReactNode[];
    subFiles: ReactNode[];
    isRoot: boolean;
}

export default function({root, path, subFolders, subFiles, isRoot}: useProps) {
    
    const [show, SetShow] = useState<boolean>(false)
    return (
        <div className="w-max">
            <div className="flex gap-1 items-center justify-left">
            
                <div onClick={() => SetShow(s => !s)}
                    className="flex gap-1 items-center hover:cursor-default font-bold">
                    {
                        !show ? (<ChevronDownIcon className="size-5"/>) : (<ChevronUpIcon className="size-5"/>)
                    }
                    <PathNode name={root.name} path={isRoot?"":path+root.name} folder={true} />
                </div>
            </div>   
            {show && (
                <div className="pl-2">
                    <div className="border-l-2 border-b-purple-500">
                        <ul className="mt-1 pl-1">
                            {subFolders}
                        </ul>
                        <ul className="pl-1">
                            {subFiles}
                        </ul>
                    </div>
                </div>
            )}        
                
            </div>
    )
}