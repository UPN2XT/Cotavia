import Editor, { OnChange } from '@monaco-editor/react';
import Tab from './Tab';
import { useEffect } from 'react';
import { Folder } from './DirectoryViewer';

interface useProps
{
    data: string
    onChange: OnChange
    path: string
    upToDateData: string
    setFunction: Function
    setFunction2: Function
    Tabs: string[]
    setTabs: Function
    root: Folder
}

export default function(parms: useProps) {

    function getLanguageFromPath(path: string) {
        // Mapping file extensions to Monaco-supported languages
        const extensionLanguageMap: {[name: string]: string} = {
            js: "javascript",
            jsx: "javascript",
            ts: "typescript",
            tsx: "typescript",
            py: "python",
            java: "java",
            c: "c",
            cpp: "cpp",
            cs: "csharp",
            html: "html",
            css: "css",
            scss: "scss",
            json: "json",
            xml: "xml",
            md: "markdown",
            php: "php",
            rb: "ruby",
            go: "go",
            rs: "rust",
            swift: "swift",
            kt: "kotlin",
            sql: "sql",
            yaml: "yaml",
            sh: "shell",
            txt: "plaintext",
        };
        if (!path) return "plaintext"
        // Extract the file extension from the path
        const segments = path.split('/');
        const fileName = segments[segments.length - 1];
        const fileExtension = fileName.split('.').pop();
        if (!fileExtension) return "plaintext"
        // Return the corresponding language or default to "plaintext"
        return extensionLanguageMap[fileExtension] || "plaintext";
    }
    
    useEffect(() => {
        if (parms.path != "" && parms.Tabs.find(s => s == parms.path) == undefined)
        {
            console.log("test")
            parms.setTabs((t: string[]) => [...t, parms.path])
        }
            
    }, [parms.path])

    const tabs = parms.Tabs.map(s => <Tab path={s} root={parms.root} setTabs={parms.setTabs} tabs={parms.Tabs}/>)

    return (
        <div className="flex-grow max-h-screen">
            
            <div className={"flex flex-col h-screen " + (parms.path? "visible": "hidden")}>
                <div className='h-[8%] rounded-lg flex justify-between items-center pl-2 pt-2'>
                    <div className='flex w-[90%] gap-1 overflow-scroll h-full'>
                        {...tabs}
                    </div>
                    {parms.path != "" && 
                    (
                    <>
                        <div className={'size-4 mr-2 rounded-full ' + ((parms.upToDateData != "") ? 'bg-yellow-300': 'bg-green-500')}
                            onClick={() => {
                                if (parms.upToDateData == "") 
                                    return
                                parms.setFunction(parms.upToDateData)
                                parms.setFunction2("")
                            }}>

                        </div>
                    </>
                )}
                </div>
                <div className='flex items-center pl-2 h-[3%] p-1 bg-neutral-900 bg-opacity-30 backdrop-blur-xl'>
                    <text className="text-sm">{parms.path.replace("/", " > ")}</text>
                </div>
                <div className='max-h-[90%] h-[88%]'>
                    <Editor className="" 
                        defaultValue="" 
                        theme="vs-dark"
                        language={getLanguageFromPath(parms.path)}
                        value={parms.data}
                        onChange={parms.onChange} />
                </div>
                
                </div>
                <div className={'h-screen flex flex-grow justify-center items-center ' + (!parms.path? "visible": "hidden")}>
                        <div className='opacity-20 text-9xl hover:cursor-default font-medium'>
                            Codavia
                        </div>
                </div>
            
        </div>
    )
}