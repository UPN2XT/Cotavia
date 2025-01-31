import { createContext } from 'react';
import { Folder } from '../pages/projects/components/DirectoryViewer';

export interface LinkData {
    socket: WebSocket | null
    setSocket: Function
    LiveUpdate: boolean
    setLiveUpdate: Function,
    LinkDirectory: Folder | null,
    setLinkDirectory: Function
}

const LinkContext = createContext<LinkData>({
    socket: null,
    setSocket: () => {},
    LiveUpdate: false,
    setLiveUpdate: () => {},
    LinkDirectory: null,
    setLinkDirectory: () => {console.log("error")}
});

export {LinkContext}