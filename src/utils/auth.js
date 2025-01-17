/**
 * managing user authentication tokens and dark mode preferences using cookies. 
 */
import Cookies from 'js-cookie'

const uToken = 'u_token'
const darkMode = 'dark_mode';

//Retrieve the user's authentication token from cookies
export function getToken() {
    return Cookies.get(uToken);
}

// set Token expires after one day,synchronize with backend 
export function setToken(token) {
    return Cookies.set(uToken, token, {expires: 1})
}

//Remove the user's authentication token from cookies
export function removeToken() {
    return Cookies.remove(uToken)
}

//Remove all cookies
export function removeAll() {
    return Cookies.Cookies.removeAll()
}

//Set the user's dark mode preference in cookies
export function setDarkMode(mode) {
    return Cookies.set(darkMode, mode, {expires: 365})
}

//Retrieve the user's dark mode preference from cookies
export function getDarkMode() {
    return !(undefined === Cookies.get(darkMode) || 'false' === Cookies.get(darkMode));
}
