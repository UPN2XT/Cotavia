import { Routes, Route } from "react-router";
import Index from './App'
import Login from "./pages/auth/login/login";
import SignUp from "./pages/auth/Signup/SignUp";
import Project from "./pages/projects/project";
import Home from "./pages/home";
import Profile from "./pages/profiles/profile";
import EditProfile from "./pages/profiles/editProfile.tsx/editProfile";
import ProfileInfo from "./pages/profiles/profileinfo/profileInfo";
import ProjectSettings from "./pages/projects/ProjectSetting/ProjectSettings";
import PSGeneral from "./pages/projects/ProjectSetting/General/PSGeneral";
import PSRoles from "./pages/projects/ProjectSetting/Roles/PSRoles";
import PSUsers from "./pages/projects/ProjectSetting/Users/PSUsers";
import WelcomePage from "./pages/auth/welcomePage";
import NotFound from "./404Page"
import ProjectPermisionsLoader from "./pages/projects/ProjectPermisionsLoader";
import Landing from "./Landing";

export default function() {
    return (
        <Routes>
            <Route path="" element={<Landing />} />
            <Route path="app" element={<Index />}>
                <Route 
                    path=""
                    element= {<Home />}
                    />
                <Route path="auth" element={<WelcomePage />}>
                    <Route path="login" element={<Login />}/>
                    <Route path="signup" element={<SignUp />}/>
                </Route>
                <Route path="project/:id" element={<ProjectPermisionsLoader />}>
                    <Route path="" element={<Project />}/>
                    <Route path="settings" element={<ProjectSettings />}>
                        <Route path="" element={<PSGeneral />} />
                        <Route path="roles" element={<PSRoles />} />
                        <Route path="users" element={<PSUsers/>} />
                    </Route>
                </Route>
                <Route path="profiles" element={<Profile />}>
                    <Route path="" element={<ProfileInfo />} />
                    <Route path="edit" element={<EditProfile />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />}/>  
        </Routes>
    )
}



