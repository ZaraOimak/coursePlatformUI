import React, {useEffect, useState} from 'react';
import {Box, Button, Container, IconButton, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ReactPlayer from "react-player";
import MDEditor from '@uiw/react-md-editor'; // Импортируем Markdown редактор
import arrowBackIcon from '../resources/arrow_back.svg';
import {positionSort} from "../utils/commons";

const Topic = ({topic, courseUuid}) => {

    const navigate = useNavigate();
    const [topicData, setTopicData] = useState({
        name: topic.name,
        uuid: topic.uuid,
        sectionUuid: topic.sectionUuid,
        description: topic.description,
        previousTopicUuid: topic.previousTopicUuid,
        nextTopicUuid: topic.nextTopicUuid,
        blocks: topic.blocks,
        position: topic.position,
    });

    useEffect(() => {
        setTopicData({...topic});
    }, [topic]);


    const onPrevious = () => {
        if (topic.previousTopicUuid) {
            navigate(`/course/${courseUuid}/topic/edit/${topic.previousTopicUuid}`);
        }
    };

    const onNext = () => {
        if (topic.nextTopicUuid) {
            navigate(`/course/${courseUuid}/topic/edit/${topic.nextTopicUuid}`);
        }
    };

    return (
        <div className="main-container"
             style={{backgroundColor: '#e3edf8', paddingBottom: '100px', minHeight: 'calc(100vh - 100px)'}}>
            <Container>

                <Box sx={{display: 'flex', alignItems: 'center', mt: 10, mb: 5}}>
                            <IconButton onClick={() => navigate(`/course/${courseUuid}`)} sx={{mr: 2}}>
                                <img src={arrowBackIcon} alt="Back to course" style={{width: '24px', height: '24px'}}/>
                            </IconButton>

                            <Box sx={{flex: 1}}>
                                <Typography variant="h4">
                                    {topicData.name}
                                </Typography>
                            </Box>
                        </Box>

                {topic.blocks.sort(positionSort).map((block, index) => (
                            <Box key={index} sx={{my: 4}}>
                                <Typography variant="h4" gutterBottom>
                                    {block.name}
                                </Typography>
                                <Box sx={{backgroundColor: '#e3edf8', p: 2, my: 2}}>
                                    {block.resources.sort(positionSort).map((resource, resourceIndex) => (
                                        <Box key={resourceIndex} data-color-mode="light" sx={{mb:2}}>
                                            {resource.resourceType === 'TEXT' && (
                                                <MDEditor.Markdown
                                                    source={resource.content}
                                                ></MDEditor.Markdown>
                                            )}
                                            {resource.resourceType === 'IMAGE' && (
                                                <img src={resource.content} alt={`Resource ${resourceIndex}`}
                                                     style={{width: '100%', height: 'auto'}}/>
                                            )}
                                            {resource.resourceType === 'VIDEO' && (
                                                <div style={{position: 'relative', width: '100%', paddingTop: '56.25%'}}>
                                                    <ReactPlayer
                                                        url={resource.content}
                                                        style={{position: 'absolute', top: 0, left: 0}}
                                                        width="100%"
                                                        height="100%"
                                                        controls
                                                    />
                                                </div>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))
                        }


                <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                    <Button
                        onClick={onPrevious}
                        disabled={!topic.previousTopicUuid}
                        sx={{
                            textTransform: 'none',
                            fontSize: 16,
                            borderRadius: '15px',
                            padding: '24px 20px',
                            minWidth: 'fit-content',
                            color: 'black',
                            backgroundColor: topic.previousTopicUuid ? '#50F1BE' : undefined,
                            '&:hover': {
                                backgroundColor: '#50F1BE',
                                filter: 'brightness(110%)',
                            },
                            '&:disabled': {
                                backgroundColor: '#CAC4D0',
                                color: 'black',
                            }
                        }}
                    >
                        Предыдущий урок
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!topic.nextTopicUuid}
                        sx={{
                            textTransform: 'none',
                            fontSize: 16,
                            borderRadius: '15px',
                            padding: '24px 20px',
                            minWidth: 'fit-content',
                            color: 'black',
                            backgroundColor: topic.nextTopicUuid ? '#50F1BE' : undefined,
                            '&:hover': {
                                backgroundColor: '#50F1BE',
                                filter: 'brightness(110%)',
                            },
                            '&:disabled': {
                                backgroundColor: '#CAC4D0',
                                color: 'black',
                            }
                        }}
                    >
                        Следующий урок
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default Topic;
