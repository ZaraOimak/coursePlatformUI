import axios from "axios";

const baseUrl = 'http://localhost:8080/courses';

export const fetchCourses = () => {
    return axios.get(baseUrl);
};
export const fetchCourse = (uuid) => {
    return axios.get(`${baseUrl}/${uuid}`).then(response => {return response.data});
};


export const deleteCourse = (courseId) => {
    return fetch(`${baseUrl}/${courseId}`, {
        method: 'DELETE',
    });
};

