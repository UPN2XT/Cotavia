import { createContext } from 'react';

export interface profile
{
    Displayname: string;
    pfp: string;
    username: string;
    connections: number
    setFunction: Function;
}

const profileContext = createContext<profile>({Displayname: "", pfp: "", username:"", connections: 0, setFunction: () => {}});

export {profileContext}