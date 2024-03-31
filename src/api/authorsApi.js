import axios from "axios";

const baseUrl = 'http://localhost:8080/authors';

export const fetchAuthors = () => {
    return axios.get(baseUrl).then(response => response.data);
};
export const fetchAuthor = (uuid) => {
    return axios.get(`${baseUrl}/${uuid}`).then(response => {
        return response.data;
    });
};
export const deleteAuthor = (authorUUID) => {
    return axios.delete(`${baseUrl}/${authorUUID}`);
};

export const createOrUpdateAuthor = (authorData) => {
    return axios.post(baseUrl, authorData);
};


