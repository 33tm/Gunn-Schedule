import { type Handler, tokens } from "server"

export const handler: Handler = (_, socket) => {
    tokens.delete(socket.id)
}