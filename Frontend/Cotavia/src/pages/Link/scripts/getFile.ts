import useCrf from "../../../hooks/useCrf"
import data from "../../../data"

export default async function(UUID: string, id: string) {
    const body = useCrf()
    body.append("ID", id)
    body.append("UUID", UUID)
    const res = await fetch(data.host+"projects/get/file", {method: "POST", body: body})
    if (res.status != 200)
            return null
    const result = await res.json()
    const res2 = await fetch(result.url)
    try {
        const results = await res2.blob()
        console.log("t2")
        return results
    } catch {
        return null
    }
}