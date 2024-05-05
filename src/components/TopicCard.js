import {Box, Card, CardContent, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchTopic} from "../api/topicsApi";

const TopicCard = ({courseUuid, topicUuid}) => {
    const [topic, setTopic] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (topicUuid) {
            fetchTopic(courseUuid, topicUuid).then(setTopic);
        }
    }, [courseUuid, topicUuid]);

    const handleCardClick = () => {
        navigate(`/course/${courseUuid}/topic/edit/${topicUuid}`);
    };

    if (!topic) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{flexGrow: 1, width: '20%', flexBasis: '25%', m: 1}}>
            <Card sx={{height: '100%'}} onClick={handleCardClick} style={{cursor: 'pointer'}}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {topic.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {topic.description}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TopicCard;
