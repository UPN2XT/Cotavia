import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import data from "../../../data"
import useCrf from "../../../hooks/useCrf"
import { useState } from "react"
import RequestCard from "./requestCard"

interface Users {
    [username: string]: {
        pfp: string
        displayname: string
    }
}

export default function() {

    const [query, setQuery] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)
    const [users, setUsers] = useState<Users>({})

    const updateMode = (username:string) => {
        setUsers(prev => {
            const output: Users = {}
            for (const key in prev)
                if (key != username)
                    output[key] = prev[key]
            return output
        })
    }

    const userCards = (() => {
        const cards = []
        for (const username in users)
            cards.push(<RequestCard username={username} pfp={users[username].pfp} displayname={users[username].displayname}
                    updatable={true} mode="s" setFunction={() => updateMode(username)} />)
        return cards
    })()

    const search = async () => {
        if (disabled) return
        setDisabled(true)
        const body = useCrf()
        body.append('query', query)
        const res = await fetch(data.host+"profiles/search", {method:'POST', body: body})
        setDisabled(false)
        if (res.status != 200) 
            return
        const result = await res.json()
        console.log(result)
        setUsers(result)

    }

    return (
        <>
            <div className="flex gap-1 items-center">
                <input className="bg-neutral-950 bg-opacity-25 backdrop-blur-2xl-2xl pl-3 pr-3 pt-2 pb-2 
                    rounded-lg"
                    placeholder="Search" value={query} onChange={e => setQuery(e.target.value)}/>
                <MagnifyingGlassIcon className="size-7 hover:cursor-pointer" onClick={search}/>
            </div>
            <div className="p-4">
                <div className="hover:cursor-pointer grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4">
                    {userCards}
                </div>
            </div>
        </>
    )
}