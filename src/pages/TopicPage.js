import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {fetchTopic} from "../api/topicsApi";
import Topic from "../components/Topic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {createEmptyTopic} from "../services/TopicService";
import "../styles/customMarkdownStyle.css";
import TopicEditor from "../components/TopicEditor";

const TopicPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { courseUuid, topicUuid } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sectionUuid = queryParams.get('sectionUuid');
    const [topic, setTopic] = useState(null);


    useEffect(() => {
        if(!topicUuid){
            setTopic(createEmptyTopic(sectionUuid));
        }
        else{
            fetchTopic(courseUuid,topicUuid).then((topicData) => {
                setTopic(topicData);
            });
        }
        const authorUUID = localStorage.getItem('authorUUID');
        if (authorUUID) {
            setIsLoggedIn(true);
        }
    }, [courseUuid, topicUuid, sectionUuid]);

    function getContent() {
            if (!topic) {
                return <div>Loading...</div>;
            }
            if (isLoggedIn) {
                return <TopicEditor topic={topic} courseUuid={courseUuid}/>;
            } else {
                return <Topic topic={topic} courseUuid={courseUuid}/>;
            }
    }

    return (
        <>
            <Header />
            {getContent()}
            <Footer/>
        </>
    );
};

export default TopicPage;
