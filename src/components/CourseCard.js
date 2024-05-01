import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cardCover from '../resources/Card cover.png';
import UpdateCourseIcon from '../resources/border_color.svg';
import { fetchAuthor } from "../api/authorsApi";

const CourseCard = ({ course, isLoggedIn }) => {
    const navigate = useNavigate();
    const [author, setAuthor] = useState();

    useEffect(() => {
        fetchAuthor(course.authorUuid).then(authorData => {
            setAuthor(authorData);
        });
    }, [course.authorUuid]);

    const openCourse = () => {
        if (isLoggedIn) {
            // Перенаправление на страницу редактирования, если пользователь залогинен
            navigate(`/course/edit/${course.uuid}`);
        } else {
            // В противном случае, открытие страницы курса
            navigate(`/course/${course.uuid}`);
        }
    };

    return (
        <Card>
            <CardActionArea onClick={openCourse}>
                <CardMedia
                    component="img"
                    image={cardCover}
                    alt="Course Cover"
                    sx={{ height: 130, width: 245 }}
                />
                <CardContent sx={{ height: 130, width: 245 }}>
                    <Typography gutterBottom variant="h6" component="div">
                        {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {author ? author.name : 'Автор не найден'}
                    </Typography>
                </CardContent>
                {isLoggedIn && (
                    <IconButton
                        sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    >
                        <img src={UpdateCourseIcon} alt="update course icon" />
                    </IconButton>
                )}
            </CardActionArea>
        </Card>
    );
};

export default CourseCard;
