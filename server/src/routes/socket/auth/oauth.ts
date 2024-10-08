import { type Handler, schoology, tokens } from "server"

export const handler: Handler = async (_, socket) => {
    const { id } = socket
    const { key, secret } = tokens.get(id)! || await schoology
        .request("GET", "/oauth/request_token")
        .then(schoology.format)
    if (!tokens.has(id)) tokens.set(id, { key, secret })
    socket.emit("token", { id, key })
}