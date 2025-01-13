import { Routes, Route } from "react-router";
import Index from './App'
import Login from "./pages/auth/login/login";
import SignUp from "./pages/auth/Signup/SignUp";
import Project from "./pages/projects/project";
import Home from "./pages/home";
import Profile from "./pages/profiles/profile";
import EditProfile from "./pages/profiles/editProfile.tsx/editProfile";
import ProfileInfo from "./pages/profiles/profileinfo/profileInfo";

export default function() {
    return (
        <Routes>
            <Route path="frontend" element={<Index />}>
                <Route 
                    path=""
                    element= {<Home />}
                    />
                <Route path="auth">
                    <Route path="login" element={<Login />}/>
                    <Route path="signup" element={<SignUp />}/>
                </Route>
                <Route path="project/:id" element={<Project />} />
                <Route path="profiles" element={<Profile />}>
                    <Route path="" element={<ProfileInfo />} />
                    <Route path="edit" element={<EditProfile />} />
                </Route>
            </Route>   
        </Routes>
    )
}



