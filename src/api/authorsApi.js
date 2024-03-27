import axios from "axios";

const baseUrl = 'http://localhost:8080/authors';

export const fetchAuthors = () => {
    return fetch(baseUrl)
        .then(response => response.json());
};
export const fetchAuthor = (uuid) => {
    return axios.get(`${baseUrl}/${uuid}`).then(response => {return response.data});
};


export const createAuthor = (authorData) => {
    return fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
    }).then(response => response.json());
};

