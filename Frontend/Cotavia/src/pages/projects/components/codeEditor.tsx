import Editor, { OnChange } from '@monaco-editor/react';
import { PaperClipIcon } from '@heroicons/react/16/solid';
import { MouseEventHandler } from 'react';
interface useProps
{
    data: string
    onChange: OnChange
    path: string
    updateFile: MouseEventHandler
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
    

    return (
        <div className="flex-grow flex flex-col max-h-fit">
            <div className='h-[7%] rounded-lg flex justify-between items-center pl-2'>
                <text className="text-md">{parms.path}</text>
                {parms.path != "" && 
                (<button onClick={parms.updateFile}>
                    <PaperClipIcon className='size-6 mr-4'/>
                </button>)}
            </div>
            
            <Editor className="flex-grow" 
                defaultValue="// some comment" 
                theme="vs-dark"
                language={getLanguageFromPath(parms.path)}
                value={parms.data}
                onChange={parms.onChange}
            />
        </div>
    )
}