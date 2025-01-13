import { Outlet } from "react-router"
import './index.css'
import Nav from "./components/nav"
import { profileContext, profile as Profile} from "./context/profileContext"
import { useState, useEffect } from "react"
import useGetUserProfile from "./hooks/useGetUserProfile"
function App() {
  
  const [profile, setProfile] = useState<Profile>({Displayname: "Test", pfp: "https://www.shutterstock.com/image-vector/pixel-art-avatar-depicting-daily-260nw-2561636717.jpg", username:"Test"})

  useEffect(() => {
      useGetUserProfile(setProfile)
  }, [])
  return (

    <profileContext.Provider value={profile}>
      <div className="p-0 m-0 h-screen w-screen flex flex-col">
        <Nav />
        <main className="p-4 flex-grow">
          <Outlet />
        </main>
      </div>
    </profileContext.Provider>
  )
}

export default App
