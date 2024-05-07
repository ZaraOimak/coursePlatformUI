import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchTopic } from '../api/topicsApi';

const TopicCard = ({ courseUuid, topicUuid }) => {
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
        <Box sx={{ minWidth: 326, maxWidth: 326, flexGrow: 1, margin: 1 }}>
            <Card
                sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s',
                    ':hover': {
                        boxShadow: '0 0 8px 2px #50F1BE'
                    },
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={handleCardClick}
            >
                <CardContent sx={{ flexGrow: 1 }}>
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
