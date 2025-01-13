import { useState, ChangeEvent, FormEvent } from "react"
import ApplicationData from "../../../data";
import useCrf from "../../../hooks/useCrf";
import AuthInputField from "../../../components/AuthInputField";
interface DATA {
    username: string;
    password: string;
}

export default function() {
    
    const [data, setData] = useState<DATA>({username: "", password: ""});

    const update = (e: ChangeEvent<HTMLInputElement>) => setData(d => ({...d, [e.target.name]: e.target.value}))

    const login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const d = useCrf()
        d.append("username", data.username)
        d.append('password', data.password)
        const response = await fetch(ApplicationData.host + "auth/login", 
            {
                method: "POST",
                body: d,
            }
        )

        const result =  response.status
        console.log(result);
    }

    return (
        <div className="flex h-full">
            <div className="flex flex-col h-full flex-grow justify-center">
                <h1 className="text-3xl self-start ml-2">Login</h1>
                    <form onSubmit={login} className="p-4 ml-2">
                            <AuthInputField name="username" value={data.username} placeholder="Username" onChange={update}/>
                            <br />
                            <AuthInputField type="password" name="password" value={data.password} placeholder="password"onChange={update}/>
                            <br />
                        <AuthInputField type="submit" value="sign in" disabled={false}/>
                </form>
            </div>
            <div className="flex-grow">
        
            </div>
        </div>
    )
}