import React, {useEffect, useState} from 'react';
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
    IconButton,
    Popover,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import mediaCard from '../resources/Media.png';
import {fetchAuthor} from "../api/authorsApi";
import avatarImage from '../resources/authorAvatar.svg';
import TopicCard from "./TopicCard";
import {createOrUpdateCourse, deleteCourse} from "../api/coursesApi";
import deleteCourseIcon from '../resources/delete.svg';
import addNewSection from '../resources/add_circle.svg';
import iconTrailing from '../resources/Trailing element.svg';
import dragIndicator from '../resources/drag_indicator.svg';
import {useNavigate} from "react-router-dom";
import EditableTextField from "./editTextField";


const Course = ({ course }) => {
    const [author, setAuthor] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing] = useState(true);
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [updatedCourse, setUpdatedCourse] = useState(course);
    const [deletedSectionIndexes, setDeletedSectionIndexes] = useState([]);
    const [addedSections, setAddedSections] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null); // Состояние якоря для Popover
    const navigate = useNavigate();
    const [selectedSectionUuid, setSelectedSectionUuid] = useState(null); // Определение состояния для хранения выбранного sectionUuid

    useEffect(() => {
        fetchAuthor(course.authorUuid).then(authorData => {
            setAuthor(authorData);
        });

        const authorUUID = localStorage.getItem('authorUUID');
        if (authorUUID) {
            setIsLoggedIn(true);
        }
    }, [course]);


    const handleSave = async () => {
        try {
            const updatedCourseData = {
                ...updatedCourse,
                name,
                description
            };

            console.log('Отправляем на сервер данные для сохранения:', updatedCourseData);

            const response = await createOrUpdateCourse(updatedCourseData);
            const {data: createdOrUpdatedCourse} = response;

            setUpdatedCourse(createdOrUpdatedCourse);

            navigate(`/course/edit/${createdOrUpdatedCourse.uuid}`);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await deleteCourse(course.uuid);
            navigate(`/`);
            console.log('Курс успешно удален.');
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
        }
    };

    const handleSectionNameChange = (sectionIndex, newName) => {
        const updatedCourseCopy = { ...updatedCourse };
        updatedCourseCopy.sections[sectionIndex].name = newName;
        setUpdatedCourse(updatedCourseCopy);
    };

    const handleDeleteSection = (sectionIndex) => {
        console.log("Удаляемая секция:", sectionIndex);
        if (sectionIndex < course.sections.length) {
            setDeletedSectionIndexes(prevIndexes => [...prevIndexes, sectionIndex]);
        } else {
            const addedSectionIndex = sectionIndex - course.sections.length;
            setAddedSections(prevSections => prevSections.filter((_, index) => index !== addedSectionIndex));
        }

        // Удаляем секцию из обновленного курса
        const updatedSections = updatedCourse.sections.filter((section, index) => index !== sectionIndex);
        setUpdatedCourse(prevState => ({
            ...prevState,
            sections: updatedSections
        }));
        setAnchorEl(null);

        // Вызываем handleSave после обновления состояния
        handleSave();
    };

    const handleAddSection = () => {
        const newSection = {
            name: "Новый модуль",
            topicsIds: []
        };

        // Обновляем состояние добавленных секций
        setAddedSections(prevSections => [...prevSections, newSection]);

        // Добавляем новую секцию к обновленному курсу
        const updatedCourseCopy = { ...updatedCourse };
        updatedCourseCopy.sections.push(newSection);
        setUpdatedCourse(updatedCourseCopy);

        // Вызываем handleSave после обновления состояния
        handleSave();
    };

    const handleClick = (event, sectionUuid) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget); // Устанавливаем якорь для Popover
        setSelectedSectionUuid(sectionUuid); // Сохраняем значение sectionUuid
    };
    const handleClose = () => {
        setAnchorEl(null); // Закрываем Popover
    };
    const open = Boolean(anchorEl); // Проверяем, открыт ли Popover
    const id = open ? 'popover-basic' : undefined;

    const handleAddTopic = async () => {
        try {
            await handleSave(); // Ожидаем завершения сохранения
            if (selectedSectionUuid) { // Проверяем, что выбранная секция не равна null
                navigate(`/course/${updatedCourse.uuid}/topic/new?sectionUuid=${selectedSectionUuid}`);
            } else {
                console.error('Не выбрана секция для добавления урока.');
            }
        } catch (error) {
            console.error('Ошибка при добавлении урока:', error);
        }
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '1000px', // Максимальная ширина контейнера курса
                    }}>
                        <Box sx={{display: 'flex', justifyContent: 'left', mt: 10, mb: 2}}>
                            <Typography variant="h5" textTransform="uppercase" gutterBottom sx={{
                                width: '100%', // Настраиваем ширину текста на всю ширину контейнера
                                maxWidth: '800px', // Максимальная ширина названия курса
                                wordWrap: 'break-word', // Перенос слов при необходимости
                            }}>
                                {isLoggedIn && isEditing ? (
                                    <EditableTextField
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Название курса"
                                        inputProps={{maxLength: 55}}
                                        fullWidth={true}
                                    />
                                ) : (
                                    <Typography>{name}</Typography>
                                )}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2}}>
                            <Card sx={{width: '100%', backgroundColor: "green", mr: 4}}>
                                <CardMedia
                                    component="img"
                                    image={mediaCard}
                                    alt="Course Cover"
                                    sx={{width: '100%', height: 'auto'}}
                                />
                            </Card>

                            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Avatar src={avatarImage} sx={{width: 40, height: 40, mr: 2}}/>
                                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography variant="subtitle1">
                                            Преподаватель: {author.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Тим-лид фронтенд-разработки в Тинькофф<br/>
                                        </Typography>
                                    </Box>
                                </Box>


                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Время на прохождение: 60 часов<br/>
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{
                                    width: '100%', // Настраиваем ширину текста на всю ширину контейнера
                                    maxWidth: '580px', // Максимальная ширина описания курса
                                    wordWrap: 'break-word', // Перенос слов при необходимости
                                    marginBottom: 2, // Добавляем нижний отступ для разделения элементов
                                }}>
                                    {isLoggedIn && isEditing ? (
                                        <EditableTextField
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Описание курса"
                                            inputProps={{maxLength: 150}}
                                            fullWidth={true}
                                        />
                                    ) : (
                                        <Typography>{description}</Typography>
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>


                    <Typography variant="h5" color="text.secondary" textTransform="uppercase" gutterBottom
                                sx={{ mt: 6, mb: 3 }}>
                        СТРУКТУРА КУРСА
                    </Typography>
                    <Card>
                        <CardContent>
                            {updatedCourse.sections.map((section, sectionIndex) => {
                                const sectionUuid = section.uuid; // Сохраняем значение section.uuid для каждого модуля
                                return (
                                    <Accordion key={sectionIndex} sx={{marginBottom: 2, position: 'relative'}}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            {isLoggedIn && isEditing ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditableTextField
                                                        value={section.name}
                                                        onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
                                                        placeholder="Название модуля"
                                                        inputProps={{maxLength: 100}}
                                                        fullWidth={true}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                    <img src={dragIndicator} alt="add module icon"
                                                         style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                                                    <Typography variant="h6">{section.name}</Typography>
                                                </Box>
                                            )}
                                            {isLoggedIn && isEditing ? (
                                                <IconButton
                                                    sx={{
                                                        width: '40px',
                                                        height: '40px',
                                                        position: 'absolute',
                                                        right: 0,
                                                        top: '50%',
                                                        marginRight: '64px',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                    onClick={(e) => handleClick(e, section.uuid)} // Передаем section.uuid в handleClick
                                                >
                                                    <img src={iconTrailing} alt="iconTr icon" />
                                                </IconButton>

                                            ) : (
                                                <></>
                                            )}
                                            <Popover
                                                id={id}
                                                open={open}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Box sx={{width: 188}}>
                                                    <Button variant="contained"
                                                            onClick={handleAddTopic}
                                                            sx={{
                                                                backgroundColor: 'white',
                                                                color: 'black',
                                                                opacity: 1,
                                                                height: '100px',
                                                                width: '100%'
                                                            }}>Добавить
                                                        урок
                                                    </Button>


                                                    <Button variant="contained" onClick={
                                                        () => handleDeleteSection(sectionIndex)
                                                    }
                                                            sx={{
                                                                backgroundColor: 'white',
                                                                color: 'black',
                                                                opacity: 1,
                                                                height: '56px',
                                                                width: '100%'
                                                            }}>Удалить
                                                        модуль</Button>
                                                </Box>
                                            </Popover>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: "center", gap: 2}}>
                                                {section.topicsIds.map((topicUuid) => (
                                                    <TopicCard key={topicUuid} courseUuid={updatedCourse.uuid} topicUuid={topicUuid} />
                                                ))}
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                );

                            })}

                            {isLoggedIn && isEditing && (
                                <AccordionDetails onClick={handleAddSection} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    height: '64px',
                                    padding: '16px'
                                }}>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            left: 0
                                        }}
                                    >
                                        <img src={addNewSection} alt="add module icon"
                                             style={{width: '24px', height: '24px'}}/>
                                    </IconButton>
                                    <Typography variant="h5" sx={{cursor: 'pointer', padding: '18.5px 32px'}}>Добавить
                                        модуль</Typography>
                                </AccordionDetails>
                            )}
                        </CardContent>
                    </Card>


                    {isLoggedIn && isEditing && (
                        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: '71px'}}>
                            <Button onClick={handleDeleteCourse}
                                    sx={{
                                        width: '174px',
                                        height: '72px',
                                        borderRadius: '15px',
                                        textAlign: 'center',
                                        padding: '24px',
                                        color: 'black',
                                        fontSize: '13px',
                                        backgroundColor: '#CAC4D0',
                                        position: 'relative',
                                        '&:hover': {
                                            backgroundColor: '#CAC4D0',
                                            opacity: 1
                                        }
                                    }}
                            >
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    <img src={deleteCourseIcon} alt="delete course icon"
                                         style={{width: '24px', height: '24px'}}/>
                                </IconButton>
                                Удалить курс
                            </Button>
                            <Button onClick={handleSave}
                                    sx={{
                                        width: '174px',
                                        height: '72px',
                                        textAlign: 'center',
                                        borderRadius: '15px',
                                        padding: '24px',
                                        fontSize: '13px',
                                        color: 'black',
                                        backgroundColor: '#50F1BE',
                                        '&:hover': {
                                            backgroundColor: '#50F1BE',
                                            opacity: 1
                                        }
                                    }}
                            >
                                Сохранить курс
                            </Button>
                        </Box>
                    )}

                </Container>
            </div>
        </>
    );
};

export default Course;