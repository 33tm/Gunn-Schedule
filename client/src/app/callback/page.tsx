"use client"

import { useEffect } from "react"

export default () => {
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: localStorage.getItem("id"),
                key: new URLSearchParams(window.location.search).get("oauth_token")
            })
        })
            .then(res => res.json())
            .catch(() => ({ jwt: null }))
            .then(({ jwt }) => {
                if (!jwt) return
                localStorage.setItem("jwt", jwt)
                new BroadcastChannel("jwt").postMessage(null)
                window.close()
            })
    }, [])

    return (
        <></>
    )
}