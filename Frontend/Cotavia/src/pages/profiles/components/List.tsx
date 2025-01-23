import { useEffect, useState, ReactNode } from "react"
import getIncomingRequests from "../scripts/ConnectionsListHandler"

interface userProps {
    mode: string;
    reload: boolean
}

export default function(props: userProps) {

    const [cards, setCards] = useState<ReactNode[]>([])

    useEffect(() => {
        getIncomingRequests(setCards, props.mode)
        .then(c => setCards(c))
    }, [props.reload])

    return cards.length > 0? (
        <div className="p-4">
            <div className="hover:cursor-pointer grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4">
                {cards}
            </div>
        </div>
    ): <p>Nothing here</p>
}