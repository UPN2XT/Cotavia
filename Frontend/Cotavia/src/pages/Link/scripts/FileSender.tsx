const CHUNK_SIZE = 1024 * 64; // 64 KB chunks

export default function(socket: WebSocket | null, file: Blob, path: string, id: string) {
    if (socket == null || file == null || path == null || id == null) return
    let offset = 0;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    socket.send(JSON.stringify({
        event: "init-transfer",
        data: {
            ID: id,
            path: path,
            totalChunks: totalChunks
        }
    }))

    const reader = new FileReader()
    reader.onload = function(e) {
        if (e.target == null) return
        const chunk = e.target.result
        const base64Data = (typeof chunk === 'string' ? chunk : '').split(',')[1]

        offset += CHUNK_SIZE
        socket.send(JSON.stringify({
            event: "load",
            data: {
                ID: id,
                path: path,
                data: base64Data
            }
        }))
        if  (offset < file.size) 
            readNext()
    }

    const readNext = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE)
        reader.readAsDataURL(slice)
    }

    readNext()
    
}