import axios from "axios";
import {host} from "./common";

const baseUrl = `${host}/courses`;

export const fetchCourses = () => {
    return axios.get(baseUrl);
};
export const fetchCourse = (uuid) => {
    return axios.get(`${baseUrl}/${uuid}`).then(response => {
        return response.data;
    });
};
export const deleteCourse = (courseUUID) => {
    return axios.delete(`${baseUrl}/${courseUUID}`);
};

export const createOrUpdateCourse = (courseData) => {
    return axios.post(baseUrl, courseData).then(response => {
        return response.data;
    });
};