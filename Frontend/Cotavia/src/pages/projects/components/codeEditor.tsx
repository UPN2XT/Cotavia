import Editor, { OnChange } from '@monaco-editor/react';
import Tab from './Tab';
import { useEffect } from 'react';
import { Folder } from './DirectoryViewer';
import { useRef } from 'react';
import extensionLanguageMap from './../../../programingLanguages'
import { DocumentIcon } from '@heroicons/react/16/solid';
interface useProps
{
    data: {
        data: string,
        type: string
    }
    onChange: OnChange
    path: string
    upToDateData: boolean
    setUpToDateData: Function
    Tabs: string[]
    setTabs: Function
    root: Folder
    updateFunction: Function
    deletedFile: boolean
}

export default function(parms: useProps) {

    function getLanguageFromPath(path: string) {
        // Mapping file extensions to Monaco-supported languages
        if (!path) return "plaintext"
        // Extract the file extension from the path
        const segments = path.split('/');
        const fileName = segments[segments.length - 1];
        const fileExtension = fileName.split('.').pop();
        if (!fileExtension) return "plaintext"
        // Return the corresponding language or default to "plaintext"
        return extensionLanguageMap[`.${fileExtension}`] || "plaintext";
    }

    const upperRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (parms.path != "" && parms.Tabs.find(s => s == parms.path) == undefined)
        {
            parms.setTabs((t: string[]) => [...t, parms.path])
        }
            
    }, [parms.path])

    const tabs = parms.Tabs.map(s => <Tab path={s} root={parms.root} setTabs={parms.setTabs} tabs={parms.Tabs}/>)
    const x = parms.path.split('/')
    const dots: React.ReactNode[] = []
    for (let i = 0; i < 3; i++)
        dots.push( <div className={'size-2 m-[0.125rem] rounded-full hover:cursor-pointer ' + (parms.deletedFile? "bg-red-500": (parms.upToDateData) ? 'bg-yellow-300': 'bg-green-500')}></div>)

    return (
        <div className="flex-grow max-h-screen">
            <div className={"flex flex-col h-screen " + (parms.path? "visible": "hidden")}>
                <div ref={upperRef}>
                    <div className='h-fit rounded-lg flex justify-between items-center pl-2 pt-2'>
                            <div className='flex w-[90%] gap-1 overflow-scroll h-full'>
                                {...tabs}
                            </div>
                            {parms.path != "" && 
                            (
                            <div className='flex pr-2'
                                onClick={() => {
                                    if (!parms.upToDateData || parms.deletedFile) 
                                        return
                                    parms.setUpToDateData(true)
                                    parms.updateFunction()
                                }}>
                               {dots}
                            </div>
                        )}
                        </div>

                        <div className='flex items-center pl-2 h-fit p-1 bg-neutral-900 bg-opacity-30 backdrop-blur-xl'>
                            <text className="text-sm">{parms.path.replace("/", " > ")}</text>
                        </div>
                </div>
                
                {
                    parms.data.type.startsWith("text")? (
                        <div className='max-h-[90%] flex-grow'
                            style={{
                                maxHeight: `calc(100vh - ${upperRef.current? upperRef.current.offsetHeight: 0}px)`
                            }}>
                            <Editor className="" 
                                defaultValue="" 
                                theme="vs-dark"
                                language={getLanguageFromPath(parms.path)}
                                value={parms.data.data}
                                onChange={parms.onChange} />
                        </div>
                    ) : parms.data.type.startsWith("text")? (
                        <div className='flex justify-center items-center p-4 flex-grow'
                            style={{
                                maxHeight: `calc(100vh - ${upperRef.current? upperRef.current.offsetHeight: 0}px)`
                            }}>
                            <img src={parms.data.data}  className='max-w-full max-h-full w-fit rounded-sm'/>
                        </div>
                    ) : (
                        <div className='flex justify-center items-center p-4 flex-grow flex-col gap-4'
                            style={{
                                maxHeight: `calc(100vh - ${upperRef.current? upperRef.current.offsetHeight: 0}px)`
                            }}>
                            <DocumentIcon className='size-10'/>
                            <div className='text-2xl'>{x[x.length - 1]}</div>
                        </div>
                    )
                }

                </div>
                <div className={'text-9xl hover:cursor-default font-medium h-screen flex flex-grow justify-center items-center opacity-50 ' 
                        + (!parms.path? "visible": "hidden")}>
                        <div className='border-t-4 pb-4'>
                            Cod
                        </div>
                        <div>
                            .
                        </div>
                        <div className='border-b-4 pt-12 pb-4'>
                            avia
                        </div>
                </div>
            
        </div>
    )
}