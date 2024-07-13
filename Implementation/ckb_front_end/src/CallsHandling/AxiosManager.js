import axios from "axios";
import {
    LOGIN_URL, SIGNUP_URL
} from "../Configuration/Environment";
import {getToken} from "../Utility/LocalStorageSaver";

axios.interceptors.request.use(function (request) {
    if (!request.url.includes(LOGIN_URL) && !request.url.includes(SIGNUP_URL)) {
        request.headers['Authorization'] = `Bearer ${getToken()}`;
    }
    else {
        request.headers['Accept'] = "application/json";
        request.headers['Content-Type'] = "application/json";
    }
    return request;
}, function (error) {
    return Promise.reject(error);
});