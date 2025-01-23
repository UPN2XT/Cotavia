import React, { forwardRef } from "react";

export interface contextInfo {
    x: number;
    y: number;
    children: React.ReactNode;
    toggle: boolean;
}

const ContextMenu = forwardRef<HTMLDivElement, contextInfo>(({ x, y, children, toggle } : contextInfo, ref) => {
    return (
        <menu
            className={"fixed p-4 rounded-lg w-64 bg-neutral-700 flex flex-col gap-4 items-start backdrop-blur-xl bg-opacity-15 z-50 " + (toggle? "visible": "hidden")}
            style={{ top: `${y}px`, left: `${x}px` }}
            ref={ref} // ✅ Now correctly forwarding ref
        >
            {children}
        </menu>
    );
});

export default ContextMenu;
