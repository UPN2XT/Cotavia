import { useState, ChangeEvent, FormEvent, useEffect, useContext } from "react"
import ApplicationData from "../../../data";
import useCrf from "../../../hooks/useCrf";
import AuthInputField from "../../../components/AuthInputField";
import { Link, useNavigate } from "react-router";
import { profileContext } from "../../../context/profileContext";
import useGetUserProfile from "../../../hooks/useGetUserProfile";
import { ShieldExclamationIcon } from "@heroicons/react/16/solid";
interface DATA {
    username: string;
    displayname: string;
    email: string;
    "confirm password": string;
    password: string;
}


export default function() {
    
    const [data, setData] = useState<DATA>({username: "", password: "", email: "", "confirm password": "", displayname: ""});

    const {setFunction} = useContext(profileContext)

    const update = (e: ChangeEvent<HTMLInputElement>) => setData(d => ({...d, [e.target.name]: e.target.value}))

    const [message, setMessage] = useState<string>(" ")

    const nav = useNavigate()

    const signup = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const d = useCrf()
            setMessage(" ")
            d.append("username", data.username)
            d.append('password', data.password)
            d.append('displayname', data.displayname)
            d.append("email", data.email)
            const response = await fetch(ApplicationData.host + "api/auth/signup", 
                {
                    method: "POST",
                    body: d,
                }
            )
    
           if (response.status == 201)
           {
                await useGetUserProfile(setFunction)
                nav("../../")
                return
           }

           const {error} = await response.json()
            setMessage(error)
        }

        useEffect(() => {
            setMessage(validateForm(data))
        }, [data])

    return (
        <>
            <h1 className="text-4xl self-start ml-2 font-semibold">New Account</h1>
            <form onSubmit={signup} className="p-4 flex-grow flex flex-col">
                <AuthInputField name="username" value={data.username} placeholder="Username" onChange={update}/>
                <AuthInputField type="text" name="displayname" value={data.displayname} placeholder="Display Name"onChange={update}/>
                <AuthInputField type="email" name="email" value={data.email} placeholder="Email"onChange={update}/>
                <AuthInputField type="password" name="password" value={data.password} placeholder="Password"onChange={update}/>
                <AuthInputField type="password" name="confirm password" value={data["confirm password"]} placeholder="Confirm Password"onChange={update}/>
                {
                    message != "" && (<text className="bg-red-500 w-4/5 p-3 rounded-lg flex gap-2 items-center">
                        <ShieldExclamationIcon className="size-6"/>
                        {message}
                    </text>)
                }
                <Link to="../login" className="mt-4">
                        Login
                </Link>
                <div className="flex justify-end p-1">
                    <button disabled={message != ""} 
                        className={(message != ""? "opacity-20": "") + " bg-neutral-700 pr-3 pl-3 pt-2 pb-2 text-xl font-medium rounded-md"}>
                        Sign up
                    </button>
                </div>
            </form>
        </>
    )
}

function validateForm(data: DATA): string {
    // Check if all fields are not empty
    for (const key in data) {
        if (!data[key as keyof DATA].trim()) {
            return `${key} must not be empty`
        }
    }

    if (data.username.length < 4)
        return "username must be atleast 4 characters long"

    // Check if passwords match
    if (data.password !== data["confirm password"]) {
        return "Error: Passwords do not match"
    }

    // Check password strength
    if (data.password.length < 8) {
        return "Error: Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(data.password)) {
        return "Error: Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(data.password)) {
        return "Error: Password must contain at least one lowercase letter"
    }
    if (!/\d/.test(data.password)) {
        return "Error: Password must contain at least one number"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        return "Error: Password must contain at least one special character"
    }
    

    // If everything is valid, return an empty string
    return ""
}