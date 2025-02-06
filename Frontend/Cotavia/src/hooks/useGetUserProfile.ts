import data from "../data"
import useCrf from "./useCrf"

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function(setProfile: Function) {
    const res = await fetch(data.host+"profiles/self", {method:"POST", body:useCrf()})
    await delay(500)
    if (res.status == 403)
    {
      return false
    }  
    const result = await res.json()
    setProfile(result)
    return true
}