import useCrf from "../../../../hooks/useCrf"
import applicationData from "../../../../data"
import { codeTextInterface } from "../../../../context/projectContext"
import useCreateTextFile from "../../../../hooks/useCreateTextFile"

const saveEvent = (e: React.KeyboardEvent, allowSave: boolean, setAllowSave: Function, id: string,
    currentPath:string, canModifyFiles:boolean, codeText: codeTextInterface) => {
    if  ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (allowSave && canModifyFiles){
            setAllowSave(false)
            if (currentPath != "")
                updateFile(currentPath, codeText, id)
                .then(() => delay(250))
                .then(() => setAllowSave(true))
        }
    }
}

export const updateFile = async (currentPath: string, codeText: codeTextInterface, id: string | undefined) => {
        const body = useCrf()
        const x = currentPath.split("/")
        const file = useCreateTextFile(x[x.length-1], codeText.data)
        body.append('ID', String(id))
        body.append('path', currentPath)
        body.append('data', file)
        body.append('Type', file.type)
        body.append('UUID', codeText.UUID)
        fetch(applicationData.host+"projects/updateFile", {method: 'POST', body: body})
        .then(res => console.log(res.status))
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default saveEvent