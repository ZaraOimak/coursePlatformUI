import axios from "axios";
// 'http://localhost:8080/courses/{course_uuid}/topics';

const baseUrl = 'http://localhost:8080/courses';

export const fetchTopics = (courseUUID) => {
    return axios.get(`${baseUrl}/${courseUUID}/topics`)
        .then(response => response.data);
};

export const fetchTopic = (courseUUID, topicUUID) => {
    return axios.get(`${baseUrl}/${courseUUID}/topics/${topicUUID}`)
        .then(response => response.data);
};

export const deleteTopic = (courseUUID, topicUUID) => {
    return axios.delete(`${baseUrl}/${courseUUID}/topics/${topicUUID}`);
};

export const createOrUpdateTopic = (courseUUID, topicData) => {
    return axios.post(`${baseUrl}/${courseUUID}/topics`, topicData)
        .then(response => response.data);
};

