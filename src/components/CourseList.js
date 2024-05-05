import React, { useEffect, useState } from 'react';
import {Box, Container, Grid, IconButton, Typography} from '@mui/material';
import { fetchCourses } from "../api/coursesApi";
import CourseCard from './CourseCard';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import addNewCourse from '../resources/add_circle.svg';


const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authorCourses, setAuthorCourses] = useState([]);
    const authorUUID = localStorage.getItem('authorUUID');
    const navigate = useNavigate();

    useEffect(() => {
        if (authorUUID) {
            setIsLoggedIn(true);
        }

        // Получить все курсы с сервера
        fetchCourses().then(response => {
            setCourses(response.data);
            // Если пользователь залогинен, фильтруем курсы по его authorUuid
            if (isLoggedIn) {
                const authorCourses = response.data.filter(course => course.authorUuid === authorUUID);
                setAuthorCourses(authorCourses);
            }
        });
    }, [authorUUID, isLoggedIn]);

    return (
        <div className="main-container" style={{ backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px' }}>
            <Container className="container mt-5">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '1040px' }}>
                    <Typography variant="h3" className="text-start">
                        {isLoggedIn ? 'Мои онлайн-курсы' : 'Все онлайн-курсы'}
                    </Typography>
                    {isLoggedIn && (
                        <Button
                            onClick={() => {
                                navigate(`/course/new`);
                            }}
                            style={{
                                width: '170px',
                                height: '56px',
                                padding: '16px',
                                backgroundColor: '#50F1BE',
                                borderColor: '#50F1BE',
                                borderRadius: '15px',
                                color: 'black',
                                position: 'relative', // Добавляем позиционирование
                            }}
                        >
                            <IconButton
                                sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} // Выравниваем иконку по вертикали
                            >
                                <img src={addNewCourse} alt="update course icon" />
                            </IconButton>
                            Создать курс
                        </Button>
                    )}
                </Box>
                <Grid container sx={{ width: 1060 }}>
                    {/* Если пользователь залогинен, отображаем только его курсы */}
                    {isLoggedIn ? (
                        authorCourses.map((course) => (
                            <Grid item key={course.uuid} sx={{ marginTop: '30px', marginRight: '20px' }}>
                                <CourseCard course={course} isLoggedIn={isLoggedIn} />
                            </Grid>
                        ))
                    ) : (
                        // Если пользователь не залогинен, отображаем все курсы
                        courses.map((course) => (
                            <Grid item key={course.uuid} sx={{ marginTop: '30px', marginRight: '20px' }}>
                                <CourseCard course={course} isLoggedIn={isLoggedIn} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </div>
    );
}

export default CourseList;
