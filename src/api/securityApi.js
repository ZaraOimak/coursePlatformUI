import axios from "axios";

export const fetchLogin = (uuid) => {
    return axios.get(`http://localhost:8080/authors/${uuid}`)
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

