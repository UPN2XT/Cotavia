import HorizontalScroll from "../../../components/general components/scroll/HorizontalScroll"
import { useEffect, useState, ReactNode } from "react"
import getIncomingRequests from "../scripts/ConnectionsListHandler"

interface userProps {
    mode: string;
}

export default function(props: userProps) {

    const [cards, setCards] = useState<ReactNode[]>([])

    useEffect(() => {
        getIncomingRequests(setCards, props.mode)
        .then(c => setCards(c))
    }, [])

    return cards.length > 0? (
        <div className="p-4">
            <h3 className="text-lg font-normal">
                {props.mode == "i"? "Incoming Connection Request": props.mode == "o"?
                     "OutGoing Connection Requests": "Connections"}
            </h3>
            <HorizontalScroll classes="min-h-44">
                {cards}
            </HorizontalScroll>
        </div>
    ): <></>
}