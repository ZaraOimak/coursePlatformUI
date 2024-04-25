import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchTopic} from "../api/topicsApi";
import Topic from "../components/Topic";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TopicPage = () => {
    const {courseUuid, topicUuid} = useParams();
    const [topic, setTopic] = useState(null);

    useEffect(() => {
        fetchTopic(courseUuid, topicUuid).then(setTopic);
    }, [courseUuid, topicUuid]);

    return <>
        <Header/>
        {
            topic ? <Topic topic={topic} courseUuid={courseUuid}/> : <div>Loading... </div>
        }
        <Footer/>
    </>
}

export default TopicPage;