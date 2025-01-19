import data from "../data"
import useCrf from "./useCrf"

export default function(setProfile: Function) {
    fetch(data.host+"profiles/self", {method:"POST", body:useCrf()})
      .then(res => res.json())
      .then(result => setProfile(result))
}