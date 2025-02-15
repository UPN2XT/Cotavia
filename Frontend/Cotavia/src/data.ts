const devalopmentMode = false

export default {
    host: devalopmentMode? `http://127.0.0.1:8000/`: 'https;//codavia-dhe8agaxheh4gmen.uaenorth-01.azurewebsites.net',
    WsHost: devalopmentMode? `ws://127.0.0.1:8000/`: 'ws://codavia-dhe8agaxheh4gmen.uaenorth-01.azurewebsites.net',
    devaloperMode: devalopmentMode
}