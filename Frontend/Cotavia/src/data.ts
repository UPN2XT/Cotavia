const devalopmentMode = true

export default {
    host: devalopmentMode? `http://127.0.0.1:8000/`: '',
    WsHost: devalopmentMode? `ws://127.0.0.1:8000/`: '',
    devaloperMode: devalopmentMode
}