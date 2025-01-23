import { Outlet } from "react-router"
import './index.css'
import { profileContext, profile as Profile} from "./context/profileContext"
import { useState, useEffect } from "react"
import useGetUserProfile from "./hooks/useGetUserProfile"
import LoadingScreen from "./components/general components/loading Screen/LoadingScreen"
import { useNavigate } from "react-router"
function App() {
  
  const [profile, setProfile] = useState<Profile>({Displayname: "", pfp: "", username:""})
  const [loaded, setLoaded] = useState<boolean>(false)
  const nav = useNavigate()
  useEffect(() => {
      useGetUserProfile(setProfile)
      .then(outcome => {
        if (outcome == false)
          nav("auth")
        setLoaded(true)
      })
  }, [])
  return (

    <profileContext.Provider value={profile}>
      <div className={"select-none h-screen w-screen bg-gradient-to-tr from-neutral-950 to-neutral-900 text-gray-100 " + (!loaded? "visible": "hidden")}>
        <LoadingScreen />
      </div>
      <div className={"select-none p-0 m-0 h-screen w-screen flex flex-col bg-gradient-to-tr from-neutral-950 to-neutral-900 text-gray-100 max-h-screen "+(loaded? "visible": "hidden")}>
        <Outlet />
      </div>
        
    </profileContext.Provider>
  )
}

export default App
