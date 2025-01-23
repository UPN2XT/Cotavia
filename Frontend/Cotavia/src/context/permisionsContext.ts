import { createContext } from 'react';

export interface permisions {
    isAdmin: boolean
    canCreate: boolean
    canDelete: boolean
    canModifyFiles: boolean
    setFunction?: Function
}

const permisionContext = createContext<permisions>({
    isAdmin: false,
    canCreate: false,
    canDelete: false,
    canModifyFiles: false,
    setFunction: () => {}
});

export {permisionContext}