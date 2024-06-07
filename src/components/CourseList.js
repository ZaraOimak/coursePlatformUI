import React, {useEffect, useState} from 'react';
import {Box, Container, Grid, Typography} from '@mui/material';
import {fetchCourses} from "../api/coursesApi";
import CourseCard from './CourseCard';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
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
        <div className="main-container"
             style={{backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px'}}>
            <Container className="container mt-5">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    width: '100%'
                }}>
                    <Typography variant="h4" className="text-start">
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
                                position: 'relative',
                                display: 'flex', // Используем flex для правильного расположения элементов
                                alignItems: 'center', // Центрируем по вертикали
                                justifyContent: 'center', // Центрируем по горизонтали
                                textAlign: 'center' // Центрируем текст
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px'
                            }}>
                                <img src={addNewCourse} alt="update course icon"
                                     style={{width: '24px', height: '24px'}}/>
                            </div>
                            <span style={{
                                display: 'block',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 'calc(100% - 32px)' // 32px - примерное место для иконки и отступа
                            }}>ДОБАВИТЬ КУРС
                            </span>
                        </Button>

                    )}
                </Box>
                <Grid container sx={{width: '100%'}}>

                    {isLoggedIn ? (
                        authorCourses.map((course) => (
                            <Grid item key={course.uuid} sx={{marginTop: '30px', marginRight: '20px'}}>
                                <CourseCard course={course} isLoggedIn={isLoggedIn}/>
                            </Grid>
                        ))
                    ) : (
                        courses.map((course) => (
                            <Grid item key={course.uuid} sx={{marginTop: '30px', marginRight: '20px'}}>
                                <CourseCard course={course} isLoggedIn={isLoggedIn}/>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </div>
    );
}

export default CourseList;
