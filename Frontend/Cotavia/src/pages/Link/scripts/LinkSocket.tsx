export default function(port: string) {
    const socket = new WebSocket(`ws://localhost:${port}`)
    return socket
}