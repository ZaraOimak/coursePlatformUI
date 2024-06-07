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
import EditableTextField from "./EditableTextField";
import ModalWindow from "./ModalWindow";
import {positionSort} from "../utils/commons";


const Course = ({ course }) => {
    const [author, setAuthor] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing] = useState(true);
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [updatedCourse, setUpdatedCourse] = useState(course);

    const [anchorEl, setAnchorEl] = useState(null); // Состояние якоря для Popover
    const navigate = useNavigate();
    const [selectedSectionUuid, setSelectedSectionUuid] = useState(null); // Определение состояния для хранения выбранного sectionUuid
    const [openModal, setOpenModal] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnailUrl || mediaCard);

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
                description,
                thumbnailUrl
            };

            console.log('Отправляем на сервер данные для сохранения:', updatedCourseData);

            createOrUpdateCourse(updatedCourseData).then(setUpdatedCourse);

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

    const handleDeleteSection = async (sectionUuid) => {
        console.log("Удаляемая секция с uuid:", sectionUuid);

        const updatedSections = updatedCourse.sections.filter(section => section.uuid !== sectionUuid);
        const updatedCourseCopy = {
            ...updatedCourse,
            sections: updatedSections
        };
        setAnchorEl(null);
        createOrUpdateCourse(updatedCourseCopy).then(setUpdatedCourse);
    };
    const handleAddSection = async () => {
        const newSection = {
            name: "Новый модуль",
            topicsIds: []
        };

        // Добавляем новую секцию к обновленному курсу
        const updatedCourseCopy = {...updatedCourse};
        updatedCourseCopy.sections.push(newSection);

        createOrUpdateCourse(updatedCourseCopy).then(setUpdatedCourse);
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

    const handleThumbnailChange = (e) => {
        setThumbnailUrl(e.target.value);
    };

    const saveThumbnailUrl = () => {
        handleSave(); // Сохраняем все изменения, включая новый URL обложки
        setOpenModal(false);
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
                        width: '100%'
                    }}>
                        <Box sx={{display: 'flex', justifyContent: 'left', mt: 10, mb: 3}}>
                                {isLoggedIn && isEditing ? (
                                    <EditableTextField
                                        name="name"
                                        value={name}
                                        onValueChange={(newValue) => setName(newValue)}
                                        placeholder="Название курса"
                                        fullWidth={true}
                                        multiline={true}
                                        variant="h4"
                                        minRows={1}
                                        maxRows={3}
                                    />
                                ) : (
                                    <Typography variant="h4">{name}</Typography>
                                )}
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2}}>
                            <Card sx={{width: '40%', height: '100%', marginRight: 4}}>
                                <CardMedia
                                    component="img"
                                    image={thumbnailUrl || mediaCard}
                                    alt="Course Cover"
                                    sx={{width: '100%', height: 'auto', cursor: 'pointer'}}
                                    onClick={() => setOpenModal(true)}
                                />
                                {isLoggedIn && isEditing && (
                                    <ModalWindow
                                        open={openModal}
                                        handleClose={() => setOpenModal(false)}
                                        title="Редактирование обложки курса"
                                        onSave={saveThumbnailUrl}
                                    >
                                        <TextField
                                            autoFocus
                                            fullWidth
                                            label="URL обложки"
                                            type="text"
                                            value={thumbnailUrl}
                                            onChange={handleThumbnailChange}
                                            variant="standard"
                                        />
                                    </ModalWindow>)
                                }
                            </Card>

                            <Box sx={{
                                width: '50%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '8px'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Avatar src={author.avatar || avatarImage} sx={{width: 40, height: 40, mr: 2}}/>
                                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                        <Typography variant="subtitle1">
                                            Преподаватель: {author.name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{flex: 1}}>
                                    {isLoggedIn && isEditing ? (
                                        <EditableTextField
                                            name="description"
                                            value={description}
                                            onValueChange={(newValue) => setDescription(newValue)}
                                            placeholder="Описание курса"
                                            multiline={true}
                                            fullWidth={true}
                                            variant="body1"
                                            minRows={3}
                                            maxRows={6}
                                        />
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">{description}</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>


                    <Typography variant="h5" color="text.secondary" textTransform="uppercase" gutterBottom
                                sx={{ mt: 6, mb: 3 }}>
                        СТРУКТУРА КУРСА
                    </Typography>
                    <Card>
                        <CardContent>

                            {updatedCourse.sections.sort(positionSort).map((section, sectionIndex) => {

                                return (
                                    <Accordion key={sectionIndex} sx={{marginBottom: 2, position: 'relative'}}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            {isLoggedIn && isEditing ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center',width:'80%' }}>
                                                    <EditableTextField
                                                        key={sectionIndex}
                                                        name="sectionName"
                                                        value={section.name}
                                                        onValueChange={(newValue) => handleSectionNameChange(sectionIndex, newValue)}
                                                        placeholder="Название модуля"
                                                        fullWidth={true}
                                                        multiline={true}
                                                        variant="h6"
                                                        minRows={1}
                                                        maxRows={3}
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
                                                                height: '56px',
                                                                width: '100%'
                                                            }}>Добавить
                                                        урок
                                                    </Button>


                                                    <Button variant="contained" onClick={
                                                        () => handleDeleteSection(selectedSectionUuid)
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

                                            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: "center"}}>
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