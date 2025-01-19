import { createContext } from 'react';

export interface profile
{
    Displayname: string;
    pfp: string;
    username: string;
}

const profileContext = createContext<profile>({Displayname: "", pfp: "", username:""});

export {profileContext}