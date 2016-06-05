export const canaryVideoApp = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, jid: action.jid, password: action.password, room: action.room}
            break;

        case "LOGOUT":
            return {...state, jid: null, password: null, room: null}
            break;

        case "XMPP_CONNECTED":
            return {...state, connectionStatus: action.status}
            break;

        case "GOT_DISCO_FEATURES":
            return {...state, discoFeatures: action.discoFeatures}
            break;

        case "GOT_DISCO_ITEMS":
            return {...state, discoItems: action.discoItems}
            break;

        case "GOT_ERROR":
            return {...state, error: action.error}
            break;

        default:
            return {...state};
            break;
    }
}
