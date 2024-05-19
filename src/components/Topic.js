import React, {useEffect, useState} from 'react';
import {Box, Button, Container, IconButton, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {createOrUpdateTopic, deleteTopic} from '../api/topicsApi';
import TopicBlocksManager from './TopicBlocksManager';
import EditableTextField from "./editTextField";
import ReactPlayer from "react-player";
import MDEditor from '@uiw/react-md-editor'; // Импортируем Markdown редактор
import arrowBackIcon from '../resources/arrow_back.svg';

const Topic = ({topic, courseUuid}) => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing] = useState(true);
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
        const authorUUID = localStorage.getItem('authorUUID');
        if (authorUUID) {
            setIsLoggedIn(true);
        }
        setTopicData({...topic});
    }, [topic]);

    const handleInputChange = (field, value) => {
        if (field === 'blocks') {
            setTopicData(prev => ({...prev, blocks: value}));
        } else {
            setTopicData(prev => ({...prev, [field]: value}));
        }
    };

    const handleSaveTopic = async () => {
        try {
            const response = await createOrUpdateTopic(courseUuid, topicData);
            console.log('Урок успешно обновлен:', response.data);
            navigate(`/course/${courseUuid}/topic/edit/${response.data.uuid}`);
        } catch (error) {
            console.error('Ошибка при сохранении урока:', error);
        }
    };

    const handleDeleteTopic = async () => {
        try {
            await deleteTopic(courseUuid, topic.uuid);
            console.log('Урок успешно удален.');
            navigate(`/course/edit/${courseUuid}`);
        } catch (error) {
            console.error('Ошибка при удалении урока:', error);
        }
    };
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
                {isLoggedIn && isEditing ? (
                    <>
                        <Box sx={{display: 'flex', alignItems: 'center', mt: 10, mb: 1}}>
                            <IconButton onClick={() => navigate(`/course/edit/${courseUuid}`)} sx={{mr: 2}}>
                                <img src={arrowBackIcon} alt="Back to course" style={{width: '24px', height: '24px'}}/>
                            </IconButton>

                            <Box sx={{flex: 1}}>
                                <EditableTextField
                                    name="name"
                                    value={topicData.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    placeholder="Название урока"
                                    fullWidth={true}
                                    multiline={true}
                                    minRows={1}
                                    maxRows={3}
                                    variant="h4"
                                />
                            </Box>

                        </Box>
                        <Box sx={{mb: 4}}>
                            <EditableTextField
                                name="description"
                                value={topicData.description}
                                onValueChange={(value) => handleInputChange('description', value)}
                                placeholder="Описание урока"
                                multiline={true}
                                minRows={3}
                                maxRows={10}
                                fullWidth={true}
                                variant="h6"
                            />
                        </Box>
                        <TopicBlocksManager
                            blocks={topicData.blocks}
                            setBlocks={newBlocks => handleInputChange('blocks', newBlocks)}
                        ></TopicBlocksManager>
                    </>
                ) : (
                    <>
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

                        {topic.blocks.map((block, index) => (
                            <Box key={index} sx={{my: 4}}>
                                <Typography variant="h4" gutterBottom>
                                    {block.name}
                                </Typography>
                                <Box sx={{backgroundColor: '#e3edf8', p: 2, my: 2}}>
                                    {block.resources.map((resource, resourceIndex) => (
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
                    </>
                )
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
                {isLoggedIn && isEditing && (
                    <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                        <Button
                            onClick={handleDeleteTopic}
                            sx={{
                                textTransform: 'none',
                                fontSize: 16,
                                borderRadius: '15px',
                                padding: '24px 20px',
                                minWidth: 'fit-content',
                                color: 'black',
                                backgroundColor: '#CAC4D0',
                                '&:hover': {
                                    backgroundColor: '#CAC4D0',
                                    filter: 'brightness(110%)',
                                }
                            }}
                        >
                        Удалить урок
                    </Button>
                        <Button
                            onClick={handleSaveTopic}
                            sx={{
                                textTransform: 'none',
                                fontSize: 16,
                                borderRadius: '15px',
                                padding: '24px 20px',
                                minWidth: 'fit-content',
                                color: 'black',
                                backgroundColor: '#50F1BE',
                                '&:hover': {
                                    backgroundColor: '#50F1BE',
                                    filter: 'brightness(110%)',
                                }
                            }}
                        >
                        Сохранить урок
                    </Button>
                    </Box>)
                }

            </Container>
        </div>
    );
};

export default Topic;
