import axios from "axios";

const baseUrl = 'http://localhost:8080/courses';

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
    // Если у courseData есть свойство uuid, то это обновление курса
    if (courseData.uuid) {
        // Используем POST запрос для обновления курса
        return axios.post(baseUrl, courseData);
    } else {

        // Используем POST запрос для создания нового курса
        return axios.post(baseUrl, courseData);
    }
};