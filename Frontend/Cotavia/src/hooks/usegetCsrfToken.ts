import data from "../data";

export default async function() {
    const res = await fetch(data.host+"api/auth/get/token")
    const result = await res.json()
    return result.csrfToken
}