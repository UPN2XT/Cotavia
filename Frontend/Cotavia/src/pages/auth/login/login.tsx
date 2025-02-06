import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import ApplicationData from "../../../data";
import useCrf from "../../../hooks/useCrf";
import AuthInputField from "../../../components/AuthInputField";
import { Link, useNavigate } from "react-router";
interface DATA {
    username: string;
    password: string;
}

export default function() {
    
    const [data, setData] = useState<DATA>({username: "", password: ""});
    const [message, setMessage] = useState<string>(" ")

    const nav = useNavigate()
    
    const update = (e: ChangeEvent<HTMLInputElement>) => setData(d => ({...d, [e.target.name]: e.target.value}))

    const login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const d = useCrf()
        d.append("username", data.username)
        d.append('password', data.password)
        const response = await fetch(ApplicationData.host + "api/auth/login", 
            {
                method: "POST",
                body: d,
            }
        )

        if (response.status == 201)
            nav("../../")

        const {error} = await response.json()
        setMessage(error)
    }
        
    useEffect(() => {
        setMessage(validateForm(data))
    }, [data])

    return (
        <>  
            <h1 className="text-4xl self-start ml-2 font-semibold">Login</h1>
                <form onSubmit={login} className="p-4 flex-grow flex flex-col">
                    <AuthInputField name="username" value={data.username} placeholder="Username" onChange={update}/>
                    <AuthInputField type="password" name="password" value={data.password} placeholder="password"onChange={update}/>
                    {
                        message != "" && <text className="text-red-500">{message}</text>
                    }
                    <Link to="../signup" className="mt-4">
                        Create new account
                    </Link>
                    <div className="flex justify-end p-1">
                        <button disabled={false} className="bg-neutral-700 pr-3 pl-3 pt-2 pb-2 text-xl font-medium rounded-md">
                            Sign in
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
            return `Error: ${key} cannot be empty`
        }
    }

    // If everything is valid, return an empty string
    return ""
}