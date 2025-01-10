import { useState, ChangeEvent, FormEvent } from "react"
import ApplicationData from "../../../data";
import useCrf from "../../../hooks/useCrf";

interface DATA {
    username: string;
    password: string;
}

export default function() {
    
    const [data, setData] = useState<DATA>({username: "", password: ""});

    const update = (e: ChangeEvent<HTMLInputElement>) => setData(d => ({...d, [e.target.name]: e.target.value}))

    const signup = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const d = useCrf()
            d.append("username", data.username)
            d.append('password', data.password)
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
        <form onSubmit={signup}>
            <input name="username" value={data.username} placeholder="Username" onChange={update}/> <br />
            <input type="password" name="password" value={data.password} placeholder="password"onChange={update}/> <br />
            <button>
                SignUp
            </button>
        </form>
    )
}