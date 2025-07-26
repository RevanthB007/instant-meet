"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Socket,io } from "socket.io-client"

const URL = 'http://localhost:3000'
const page = ({name}:{name:string}) => {
    const searchParams = useParams()
    const roomId = searchParams.name
    const [socket, setSocket] = useState<null | Socket>(null)
    const [lobby, setLobby] = useState(false)
    console.log(roomId) 
    useEffect(() => {
        const socket = io(URL)
        socket.on('send-offer', ({roomId}) => {
            setLobby(false)
            console.log("page send-offer",roomId);
            alert("send offer please")
            socket.emit("offer",{
                sdp:"",
                roomId
            })
        })

        socket.on("offer",({roomId,offer}) =>{
            console.log("page offer",roomId);
            setLobby(false)
            alert("send answer please")
            socket.emit("answer",{
                sdp:"",
                roomId:roomId,
            })
        },)

        socket.on("answer",({roomId,answer}) => {
            setLobby(false)
            console.log("page answer",roomId);
            alert("connection done")
        })

        socket.on("lobby",() =>{
            setLobby(true)
        })
        setSocket(socket)

    },[])

    if (lobby) return <div>Waiting for someone to connect</div>
    return (
        <div>
            Hi {roomId}
            <video width={400} height={400}/>
            <video width={400} height={400}/>
        </div>
    )
}

export default page
