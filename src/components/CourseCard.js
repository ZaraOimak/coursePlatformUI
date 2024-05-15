import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cardCover from '../resources/Card cover.png';
import {fetchAuthor} from "../api/authorsApi";

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
            navigate(`/course/edit/${course.uuid}`);
        } else {
            navigate(`/course/${course.uuid}`);
        }
    };

    return (
        <Card sx={{
            transition: 'box-shadow 0.3s', // Плавный переход
            ':hover': {
                boxShadow: '0 0 8px 2px #50F1BE', // Тень по всему периметру карточки
            }
        }}>
            <CardActionArea onClick={openCourse}>
                <CardMedia
                    component="img"
                    image={course.thumbnailUrl || cardCover}
                    alt="Course Cover"
                    sx={{ height: 130, width: 245 }}
                />
                <CardContent sx={{ height: 130, width: 245 }}>
                    <Typography gutterBottom variant="body1" component="div">
                        {course.name}
                    </Typography>
                    <Typography sx={{color:"black"}} variant="body2" color="text.secondary">
                        {author ? author.name : 'Автор не найден'}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseCard;
