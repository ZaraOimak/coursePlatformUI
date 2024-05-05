import React, {useEffect, useState} from 'react';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import ReactPlayer from 'react-player';
import {createOrUpdateTopic, deleteTopic} from '../api/topicsApi';

const Topic = ({topic, courseUuid}) => {
    const navigate = useNavigate();
    const mdParser = new MarkdownIt();

    // Создаем состояние для хранения значений полей урока
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

    const buttonSx = {
        textTransform: 'none',
        fontSize: 16,
        borderRadius: '15px',
        padding: '24px 20px',
        ':hover': {
            backgroundColor: (theme) => theme.palette.success.main,
            filter: 'brightness(110%)',
        },
        ':disabled': {
            backgroundColor: '#CAC4D0',
            color: 'black',
        },
        minWidth: 'fit-content',
        color: 'black',
    };

    useEffect(() => {
        setTopicData({...topic})
    }, [topic]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        // Обновляем значения полей урока при изменении ввода
        setTopicData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveTopic = async () => {
        try {
            let createdOrUpdatedTopic;

            // Подготавливаем данные для отправки на сервер
            const topicDataToSend = {
                ...topicData,
                sectionUuid: topic.sectionUuid,
                previousTopicUuid: topic.previousTopicUuid,
                nextTopicUuid: topic.nextTopicUuid,
                blocks: topic.blocks,
                position: topic.position
            };

            // Урок новый, выполняем создание
            const response = await createOrUpdateTopic(courseUuid, topicDataToSend);
            createdOrUpdatedTopic = response.data;
            console.log('Урок успешно создан:', createdOrUpdatedTopic);

            // Перенаправляем пользователя на страницу редактирования урока
            navigate(`/course/${courseUuid}/topic/edit/${createdOrUpdatedTopic.uuid}`);
        } catch (error) {
            console.error('Ошибка при сохранении урока:', error);
        }
    };

    const handleDeleteTopic = async () => {
        try {
            await deleteTopic(courseUuid, topic.uuid);
            console.log('Урок успешно удален.');
            navigate(`/course/edit/${courseUuid}`);
            // Перенаправление пользователя на главную страницу или другую нужную страницу
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

    return <>
        <div className="main-container" style={{
            backgroundColor: '#e3edf8', paddingBottom: '100px', minHeight: 'calc(100vh - 100px)'
        }}>

            <Container>
                <Typography variant="h4" gutterBottom>
                    {/* Используем состояние для отображения и редактирования имени урока */}
                    <TextField
                        name="name"
                        value={topicData.name}
                        onChange={handleInputChange} // Добавляем обработчик события onChange
                        label="Название урока"
                        fullWidth
                        variant="outlined"
                    />
                </Typography>
                <Typography>
                    {/* Используем состояние для отображения и редактирования описания урока */}
                    <TextField
                        name="description"
                        value={topicData.description}
                        onChange={handleInputChange} // Добавляем обработчик события onChange
                        label="Описание урока"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                    />
                </Typography>
                {topic.blocks.map((block, index) => (
                    <Box key={index} sx={{my: 4}}>
                        <Typography variant="h6" gutterBottom>
                            {block.name}
                        </Typography>
                        <Box sx={{backgroundColor: '#e3edf8', p: 2, my: 2}}>
                            {block.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex}>
                                    {resource.resourceType === 'TEXT' && (
                                        <div dangerouslySetInnerHTML={{ __html: mdParser.render(resource.content) }} />
                                    )}
                                    {resource.resourceType === 'IMAGE' && (
                                        <img src={resource.content} alt={`Resource ${resourceIndex}`}
                                             style={{width: '100%', height: 'auto'}}/>
                                    )}
                                    {resource.resourceType === 'VIDEO' && (
                                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
                                            <ReactPlayer url={resource.content} width="100%" height="100%" controls/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Box>
                    </Box>
                ))}
                <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                    <Button
                        onClick={onPrevious}
                        disabled={!topic.previousTopicUuid}
                        sx={{
                            ...buttonSx,
                            backgroundColor: topic.previousTopicUuid ? '#50F1BE' : undefined,
                        }}
                    >
                        Предыдущий урок
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!topic.nextTopicUuid}
                        sx={{
                            ...buttonSx,
                            backgroundColor: topic.nextTopicUuid ? '#50F1BE' : undefined,
                        }}
                    >
                        Следующий урок
                    </Button>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                    <Button onClick={handleDeleteTopic} sx={{...buttonSx, backgroundColor: '#CAC4D0'}}>
                        Удалить урок
                    </Button>
                    <Button onClick={handleSaveTopic} sx={{...buttonSx, backgroundColor: '#50F1BE'}}>
                        Сохранить урок
                    </Button>
                </Box>
            </Container>


        </div>
    </>

};

export default Topic;
