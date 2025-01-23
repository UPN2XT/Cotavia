import { MouseEvent } from "react";

export default function(ref: React.RefObject<HTMLInputElement>, toggleFunc: Function) {
    
    const handler = (e: globalThis.MouseEvent) => {
        if (ref.current && e.target instanceof Node)
            if (!ref.current.contains(e.target))
                toggleFunc(false)
    }
    
    const on = (e: MouseEvent) => {
        e.preventDefault()
        if (ref.current == null) return
        let x
        let y
        if (e.clientX < window.innerWidth / 2)
            x = e.clientX
        else
            x = e.clientX - ref.current.width
        if (e.clientY < window.innerHeight / 2)
            y = e.clientY
        else
            y = e.clientY - ref.current.height
        toggleFunc(true)
        return [x, y]
    }

    document.addEventListener('click', handler)

    const deleteEvent = () => {
        document.removeEventListener('click', handler)
    }

    return [on, deleteEvent]
}