import axios from "axios";
import {host} from "./common";

export const fetchLogin = (uuid) => {
    return axios.get(`${host}/authors/${uuid}`)
        .then(response => {
            if (response.data) {
                return {isValid: true, author: response.data};
            } else {
                return {isValid: false, error: "No such author exists."};
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            return {isValid: false, error: error.response ? error.response.data : "Unknown error"};
        });
};

