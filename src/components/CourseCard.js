import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cardCover from '../resources/Card cover.png';
import UpdateCourseIcon from '../resources/border_color.svg';

const CourseCard = ({ course, isLoggedIn }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(course.name);
    const [newDescription, setNewDescription] = useState(course.description);

    const openCourse = () => {
        navigate(`/course/${course.uuid}`);
    };

    const handleEditCourse = () => {
        setIsEditing(true); // Включить режим редактирования
    };

    const handleSaveChanges = () => {
        // Сохранение изменений имени и описания курса
        setIsEditing(false); // Завершение редактирования
        // Отправка данных на сервер или другие необходимые действия
    };

    return (
        <Card>
            <CardActionArea >
                <CardMedia onClick={isEditing ? undefined : openCourse}
                           component="img"
                           image={cardCover}
                           alt="Course Cover"
                           sx={{ height: 130, width: 245 }}
                />
                <CardContent sx={{ height: 130, width: 245, overflowY: 'auto' }}>
                    {isEditing ? (
                        <>
                            <TextField
                                fullWidth
                                label="Название курса"
                                variant="outlined"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                sx={{ marginBottom: 1 }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Описание курса"
                                variant="outlined"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <Typography gutterBottom variant="h5" component="div">
                                {course.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {course.description}
                            </Typography>
                        </>
                    )}
                    {isLoggedIn && (
                        <IconButton
                            disabled={isEditing}
                            onClick={isEditing ? handleSaveChanges : handleEditCourse}
                            sx={{ position: 'absolute', bottom: 0, right: 0 }}
                        >
                            <img src={UpdateCourseIcon} alt="update course icon"/>
                        </IconButton>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseCard;
