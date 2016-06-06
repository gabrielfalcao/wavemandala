export const wavemandalaApp = (state, action) => {
    switch (action.type) {
        case "LIST_TRACKS":
            return {...state, tracks: action.tracks}
            break;
        default:
            return {...state};
            break;
    }
}
