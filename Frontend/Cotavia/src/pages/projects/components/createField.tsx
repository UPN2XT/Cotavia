import applicationData from "../../../data"
import useCrf from "../../../hooks/useCrf"
import useCreateTextFile from "../../../hooks/useCreateTextFile"
import useFileUpload from "../../../hooks/useFileUpload"
import { FolderPlusIcon, DocumentPlusIcon, ArrowUpTrayIcon } from "@heroicons/react/16/solid"

interface useProps{
    id: string,
    rootRef: string,
    toggleFunction: Function
    UUID: string
    nameVal: string;
}

export default function(props: useProps) {

    const upload = async () => {
        props.toggleFunction()
        const files = await useFileUpload()
        if (files == null) return
        for (const file of files)
            create(file.name, file.type, file, true)
    }

    const create = (name: string, type: string, file: File | null, isFile:boolean) => {
        const body = useCrf()
        body.append('ID', props.id)
        body.append('name', name)
        body.append('UUID', props.UUID)
        file && body.append('data', file)
        body.append("Type", type)
        fetch(applicationData.host+`projects/create/${isFile?"file":"folder"}`, {method:"POST", body: body})
    }

    const createFile = () => {
        props.toggleFunction()
        const file = useCreateTextFile(props.nameVal, "...")
        create(props.nameVal, file.type, file, true)
    }

    const createFolder = () => {
        props.toggleFunction()
        create(props.nameVal, "", null, false)
    }


    return (
        <>
            <div className="flex justify-between w-full">
                <button className="w-fit text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex flex-col items-center"
                    onClick={createFile}
                    disabled={props.nameVal==""}>
                    <DocumentPlusIcon className="size-7"/>
                    <div className="text-xs">
                        file
                    </div>
                </button>
                <button className="w-fit text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex flex-col items-center"
                     onClick={createFolder}
                     disabled={props.nameVal==""}>
                    <FolderPlusIcon className="size-7"/>
                    <div className="text-xs">
                        folder
                    </div>
                </button>
                <button className="w-fit text-lg text-start rounded-md hover:bg-black hover:bg-opacity-15 p-2 flex flex-col items-center"
                    onClick={upload}>
                    <ArrowUpTrayIcon className="size-7"/>
                    <div className="text-xs">
                        upload
                    </div>
                </button>
            </div>
        </>
    )
}