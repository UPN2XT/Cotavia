import { useState, ChangeEvent, FormEvent } from "react"
import ApplicationData from "../../../data";
import useCrf from "../../../hooks/useCrf";
import AuthInputField from "../../../components/AuthInputField";
interface DATA {
    username: string;
    displayname: string;
    email: string;
    repassword: string;
    password: string;
}

export default function() {
    
    const [data, setData] = useState<DATA>({username: "", password: "", email: "", repassword: "", displayname: ""});

    const update = (e: ChangeEvent<HTMLInputElement>) => setData(d => ({...d, [e.target.name]: e.target.value}))

    const signup = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const d = useCrf()
            d.append("username", data.username)
            d.append('password', data.password)
            d.append('displayname', data.displayname)
            d.append("email", data.email)
            const response = await fetch(ApplicationData.host + "auth/signup", 
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
                <h1 className="text-3xl self-start ml-2">New Account</h1>
                <form onSubmit={signup} className="p-4 ml-2">
                    <AuthInputField name="username" value={data.username} placeholder="Username" onChange={update}/>
                    <br />
                    <AuthInputField type="text" name="displayname" value={data.displayname} placeholder="Display Name"onChange={update}/>
                    <br />
                    <AuthInputField type="email" name="email" value={data.email} placeholder="Email"onChange={update}/>
                    <br />
                    <AuthInputField type="password" name="password" value={data.password} placeholder="Password"onChange={update}/>
                    <br />
                    <AuthInputField type="password" name="repassword" value={data.repassword} placeholder="Retype password"onChange={update}/>
                    <br />
                    <AuthInputField type="submit" value="Sign Up" disabled={false}/>
                </form>
            </div>
            <div className="flex-grow">

            </div>
        </div>
    )
}