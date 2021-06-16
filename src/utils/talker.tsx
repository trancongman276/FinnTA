import axios from 'axios'
import {
    SignUpAccountData,
    resAccount,
    chat,
    classroom
} from 'global/dataType'

export const Conn = axios.create({
    baseURL: 'http://localhost:27017',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    },
    withCredentials: true,
})

// Account
async function register(data: SignUpAccountData) {
    let res = await Conn.post('/user/register', JSON.stringify(data))
    if (res.status !== 200)
        return "Error occurred during the registration."
}

async function getAccount(data: { ID: string }) {
    let res = await Conn.get<resAccount>('/user', { params: { id: data.ID } })
    if (res.status !== 200)
        return "Error occurred when getting Account."
    return res.data
}

//TA
async function getSortTA(_sort: "des" | "asc", _by: "rate" | "name", _page: number) {
    type resApi = {
        "TA": resAccount[],
        "Class": { [_id: string]: string[] },
    }
    let res = await Conn.get<resApi>('/user/TA', { params: { sort: _sort, by: _by, page: _page } })
    if (res.status !== 200) {
        alert("Error occurred when getting T.A.")
        return {} as resApi
    }
    return res.data
}

async function getClassroom(data: { uid: string, page: number }) {
    const res = await Conn.get<classroom[]>('/class', { params: data })
    return res
}

// Chat
async function sendMsg(data: { RoomID: string, Msg: string }) {
    type response = {
        ID: string
    }
    let res = await Conn.put<response>('/chat', JSON.stringify(data))
    if (res.status !== 200)
        return "Error occurred when sending msg."
    return res.data.ID
}

async function getMsg(RoomID: string, page: number) {
    let res = await Conn.get<chat>('/chat', { params: { room: RoomID, page: page } })
    if (res.status !== 200)
        return "Error occurred when getting msg."
    return res.data
}

const Account = {
    register,
    getAccount,
}

const TA = {
    getSortTA,
    getClassroom
}

const Chat = {
    sendMsg,
    getMsg
}

export default {
    Account,
    TA,
    Chat
}