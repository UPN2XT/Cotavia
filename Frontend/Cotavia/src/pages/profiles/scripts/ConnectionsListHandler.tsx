import data from "../../../data"
import useCrf from "../../../hooks/useCrf"
import RequestCard from "../components/requestCard"

export default async function(setFunction: Function, mode: string) {
    const body = useCrf()
    body.append("mode", mode)
    const response = await fetch(data.host+"profiles/reqs", {method:'POST', body:body})
    const result = await response.json()
    const cards = []
    for (const key in result) {
        cards.push((<RequestCard username={key} displayname={result[key].Displayname} pfp={result[key].pfp}
                setFunction={setFunction} mode={mode}/>))
    }
    return cards
}