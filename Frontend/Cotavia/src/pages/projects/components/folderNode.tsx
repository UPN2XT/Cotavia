import PathNode from "./pathNode"
import CreateField from "./createField"
import { Folder } from "./DirectoryViewer"
import { ReactNode, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "@heroicons/react/16/solid";

interface useProps {
    root: Folder;
    path: String;
    id: string | undefined;
    rootRef: string;
    subFolders: ReactNode[];
    subFiles: ReactNode[];
    setCodeText: Function;
    setCurentPath: Function;
}

export default function({root, path, id, rootRef, subFolders, subFiles, setCodeText, setCurentPath}: useProps) {
    
    const [show, SetShow] = useState<boolean>(false)
    const [ShowCreation, setShowCreation] = useState<boolean>(false)
    return (
        <div className="w-max">
            <div className="flex gap-1 items-center justify-right">
            <PlusIcon className="size-4" onClick={() => setShowCreation(e => !e)}/>
                <div onClick={() => SetShow(s => !s)}
                    className="flex gap-1 items-center hover:cursor-default font-bold">
                    {
                        !show ? (<ChevronDownIcon className="size-4"/>) : (<ChevronUpIcon className="size-4"/>)
                    }
                    <PathNode name={root.name} path={path+root.name} folder={true} data="" updateFunctionText={setCodeText} updateFunctionPath={setCurentPath}/>
                </div>
            </div>   
            {ShowCreation && <CreateField id={String(id)} rootRef={rootRef}/>}
            {show && (
                <>
                    <ul className="pl-3 mt-1">
                        {subFolders}
                    </ul>
                    <ul className="pl-3">
                        {subFiles}
                    </ul>
                </>
            )}        
                
            </div>
    )
}