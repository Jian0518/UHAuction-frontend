import Cookies from 'js-cookie'

const uToken = 'u_token'
const darkMode = 'dark_mode';


export function getToken() {
    return Cookies.get(uToken);
}

// set Token expires after one day,synchronize with backend 
export function setToken(token) {
    return Cookies.set(uToken, token, {expires: 1})
}


export function removeToken() {
    return Cookies.remove(uToken)
}

export function removeAll() {
    return Cookies.Cookies.removeAll()
}

export function setDarkMode(mode) {
    return Cookies.set(darkMode, mode, {expires: 365})
}

export function getDarkMode() {
    return !(undefined === Cookies.get(darkMode) || 'false' === Cookies.get(darkMode));
}
