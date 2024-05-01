import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
    TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import mediaCard from '../resources/Media.png';
import { fetchAuthor } from "../api/authorsApi";
import avatarImage from '../resources/authorAvatar.svg';
import TopicCard from "./TopicCard";
import { createOrUpdateCourse } from "../api/coursesApi";

const Course = ({ course }) => {
    const [author, setAuthor] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [updatedCourse, setUpdatedCourse] = useState(course);
    const [deletedSectionIndexes, setDeletedSectionIndexes] = useState([]);
    const [addedSections, setAddedSections] = useState([]);

    useEffect(() => {
        fetchAuthor(course.authorUuid).then(authorData => {
            setAuthor(authorData);
        });

        const authorUUID = localStorage.getItem('authorUUID');
        if (authorUUID) {
            setIsLoggedIn(true);
        }
    }, [course]);

    const handleEdit = () => {
        setIsEditing(true);
    };


    const handleSave = async () => {
        try {
            const updatedCourseData = {
                ...updatedCourse,
                name,
                description,
                sections: updatedCourse.sections.filter(section => section.topicsIds.length === 0) // Отфильтровываем секции без уроков
            };

            console.log('Отправляем на сервер данные для сохранения:', updatedCourseData);

            await createOrUpdateCourse(updatedCourseData);
            setIsEditing(false);
            setUpdatedCourse(updatedCourseData);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };


    const handleSectionNameChange = (sectionIndex, newName) => {
        const updatedCourseCopy = { ...updatedCourse };
        updatedCourseCopy.sections[sectionIndex].name = newName;
        setUpdatedCourse(updatedCourseCopy);
    };
    const handleCancel = () => {
        setName(course.name);
        setDescription(course.description);
        setIsEditing(false);
        setUpdatedCourse(course);
        setDeletedSectionIndexes([]);
        setAddedSections([]);
    };

    const handleDeleteSection = (sectionIndex) => {
        console.log("Удаляемая секция:", sectionIndex);
        if (sectionIndex < course.sections.length) {
            setDeletedSectionIndexes(prevIndexes => [...prevIndexes, sectionIndex]);
        } else {
            const addedSectionIndex = sectionIndex - course.sections.length;
            setAddedSections(prevSections => prevSections.filter((_, index) => index !== addedSectionIndex));
        }
        const updatedSections = updatedCourse.sections.filter((section, index) => index !== sectionIndex);
        setUpdatedCourse(prevState => ({
            ...prevState,
            sections: updatedSections
        }));
    };

    const handleAddSection = () => {
        const newSection = {
            name: "Новая секция",
            topicsIds: []
        };
        setAddedSections(prevSections => [...prevSections, newSection]);
        const updatedCourseCopy = { ...updatedCourse };
        updatedCourseCopy.sections.push(newSection);
        setUpdatedCourse(updatedCourseCopy);
    };



    if (!updatedCourse || !author) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="main-container" style={{
                backgroundColor: '#e3edf8', paddingBottom: '100px', minHeight: 'calc(100vh - 100px)'
            }}>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'left', mt: 10, mb: 2 }}>
                        <Typography variant="h5" textTransform="uppercase" gutterBottom>
                            {isEditing ? (
                                <TextField
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    label="Название курса"
                                    inputProps={{ maxLength: 55 }} // Максимальная длина названия курса
                                />
                            ) : (
                                name
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Card sx={{ width: '35%', backgroundColor: "green", mr: 5 }}>
                            <CardMedia
                                component="img"
                                image={mediaCard}
                                alt="Course Cover"
                                sx={{ width: 415, height: 260 }}
                            />
                        </Card>

                        <Box sx={{ width: '50%', marginRight: 4, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar src={avatarImage} sx={{ width: 40, height: 40, mr: 2 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="subtitle1">
                                        Преподаватель: {author.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Тим-лид фронтенд-разработки в Тинькофф<br />
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Время на прохождение: 60 часов<br />
                                </Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                                {isEditing ? (
                                    <TextField
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        label="Описание курса"
                                        multiline
                                        rows={4}
                                    />
                                ) : (
                                    description
                                )}
                            </Typography>
                        </Box>
                    </Box>

                    {isLoggedIn && !isEditing && (
                        <Button onClick={handleEdit}>Редактировать</Button>
                    )}

                    {isLoggedIn && isEditing && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button onClick={handleSave}>Сохранить</Button>
                            <Button onClick={handleCancel}>Отменить</Button>
                            <Button onClick={handleAddSection}>Добавить секцию</Button>
                        </Box>
                    )}

                    <Typography variant="h5" color="text.secondary" textTransform="uppercase" gutterBottom
                                sx={{ mt: 6, mb: 3 }}>
                        СТРУКТУРА КУРСА
                    </Typography>
                    <Card>
                        <CardContent>
                            {updatedCourse.sections.map((section, sectionIndex) => (
                                <Accordion key={sectionIndex} sx={{ marginBottom: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        {isEditing ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                                <TextField
                                                    value={section.name}
                                                    onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
                                                    label="Название секции"
                                                    sx={{ width: '300px', wordWrap: 'break-word' }} // Перенос текста на новую строку при необходимости
                                                />

                                                <Button onClick={() => handleDeleteSection(sectionIndex)}>Удалить секцию</Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="h6">{section.name}</Typography>
                                        )}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box sx={{
                                            display: 'flex', flexWrap: 'wrap', justifyContent: "center", gap: 2
                                        }}>
                                            {section.topicsIds.map((topicUuid) => (
                                                <TopicCard key={topicUuid} courseUuid={updatedCourse.uuid} topicUuid={topicUuid} />
                                            ))}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </CardContent>
                    </Card>
                </Container>
            </div>
        </>
    );
};

export default Course;
