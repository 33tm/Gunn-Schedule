import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/auth`, { autoConnect: false })

export const Auth = () => {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("jwt")) {
            setStatus(true)
        }
        new BroadcastChannel("jwt").onmessage = () => {
            setStatus(true)
            socket.disconnect()
        }
    }, [])

    const auth = () => {
        if (status) {
            localStorage.removeItem("jwt")
            setStatus(false)
        } else {
            if (!socket.connected) socket.connect()
            socket.emit("oauth")
            socket.once("token", ({ id, key }) => {
                localStorage.setItem("id", id)
                window.open(
                    `https://pausd.schoology.com/oauth/authorize?oauth_token=${key}&oauth_callback=${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
                    "_blank",
                    `popup, width=480, height=675, left=${(screen.width - 480) / 2} top=${(screen.height - 675) / 2}`
                )
            })
        }
    }

    return (
        <Button onClick={auth}>
            {status ? "Sign Out" : "Sign In"}
        </Button>
    )
}