import { createContext } from 'react';
import { contextInfo } from '../pages/projects/components/contextMenu';

export interface TransferInfo {
    from: string,
    to: string,
    type: string,
    copy: false
}

export interface InfoMenu {
    path: string;
    toggle: boolean;
    type: string
}

export interface codeTextInterface {
    data: "",
    type: ""
}


export interface project {
    isAdmin: boolean
    currentPath: string
    ref?: React.MutableRefObject<HTMLDivElement | null>
    setCurrentPath: Function
    setContextInfo: Function
    contextInfo: contextInfo
    transferInfo: TransferInfo
    setTransferInfo: Function;
    data: string
    setData: Function
    setPath: Function
    MenuInfo: InfoMenu
    setMenuInfo: Function
    offsetH: number,
    codeText: codeTextInterface,
    setCodeText: Function
}

const projectContext = createContext<project>({
    isAdmin: false,
    currentPath: "",
    setContextInfo: () => {},
    setCurrentPath: () => {},
    contextInfo: {
        x: 0,
        y: 0,
        toggle: false,
        children: <></>
    },
    transferInfo: {
        from: "",
        to: "",
        type: "",
        copy: false
    },
    data: "",
    setTransferInfo: () => {},
    setData: () => {},
    setPath: () => {},
    MenuInfo: {
        path: "",
        toggle: false,
        type:  ""
    },
    setMenuInfo: () => {},
    offsetH: 0,
    codeText: {type: "", data: ""},
    setCodeText: () => {}
});

export {projectContext}

