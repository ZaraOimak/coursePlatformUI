import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchTopic } from "../api/topicsApi";
import Topic from "../components/Topic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopicService from "../services/TopicService";
import "../styles/customMarkdownStyle.css";

const TopicPage = () => {
    const { courseUuid, topicUuid } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sectionUuid = queryParams.get('sectionUuid');
    const [topic, setTopic] = useState(null);


    useEffect(() => {
        if(!topicUuid){
            const topicService = new TopicService();
            setTopic(topicService.createEmptyTopic(sectionUuid));
        }
        else{
            fetchTopic(courseUuid,topicUuid).then((topicData) => {
                setTopic(topicData);
            });
        }
    }, [courseUuid, topicUuid, sectionUuid]);

    return (
        <>
            <Header />
            {/* Проверяем, загружены ли данные */}
            {topic ? <Topic topic={topic} courseUuid={courseUuid}/> : <div>Loading...</div>}
            <Footer/>
        </>
    );
};

export default TopicPage;
