const API_TOKEN_KEY = "apiToken";
const USER_NAME_KEY = "userName";

//this component handles the saving of information into the browser's local storage (to then use them in the future)

export const getToken = () => {
    return localStorage.getItem(API_TOKEN_KEY);
}

export const setToken = (newTokenValue) => {
    localStorage.setItem(API_TOKEN_KEY, newTokenValue);
}

export const getUserName = () => {
    return localStorage.getItem(USER_NAME_KEY);
}

export const setUserName = (newUserNameValue) => {
    localStorage.setItem(USER_NAME_KEY, newUserNameValue);
}