import data from "../../../../../data"
import useCrf from "../../../../../hooks/useCrf"
import {user} from "../components/userCard"

const fetchUsers = (url: string, setFunction: Function, id: string | undefined) => {
    const body = useCrf()
    body.append("ID", String(id))
    fetch(data.host+url, {
        method: "POST",
        body: body
    })
    .then(res => res.json())
    .then(result => createUserList(result, setFunction))
}

const createUserList = (users: {[username: string]: user}, setFunction: Function) => {
    const userList: user[] = []
    for (const username in users)
        userList.push({
            username: username,
            displayname: users[username].displayname,
            pfp: users[username].pfp
        })
    setFunction(userList)
}

export default fetchUsers