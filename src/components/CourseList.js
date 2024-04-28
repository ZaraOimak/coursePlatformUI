

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { fetchCourses } from "../api/coursesApi";
import CourseCard from './CourseCard';
import { Button } from "react-bootstrap";
import CourseService from "../services/CourseService";
import {useNavigate} from "react-router-dom";

const courseService = new CourseService();

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const authorUUID = localStorage.getItem('authorUUID');
    const navigate = useNavigate();

    useEffect(() => {
        if (authorUUID) {
            setIsLoggedIn(true);
        }

        fetchCourses().then(response => {
            setCourses(response.data);
        });
    }, [authorUUID]);


    return (
        <>
            <div className="main-container"
                 style={{ backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px' }}>
                <Container className="container mt-5">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '1040px' }}>
                        <Typography variant="h3" className="text-start">
                            {isLoggedIn ? 'Мои онлайн-курсы' : 'Все онлайн-курсы'}
                        </Typography>
                        {isLoggedIn && (
                            <Button
                                onClick={() => {
                                    const emptyCourse = courseService.createEmptyCourse(authorUUID);
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
                                }}
                            >
                                Создать курс
                            </Button>
                        )}
                    </Box>
                    <Grid container sx={{ width: 1060 }}>
                        {courses.map((course) => (
                            <Grid item key={course.uuid} sx={{ marginTop: '30px', marginRight: '20px' }}>
                                <CourseCard course={course} isLoggedIn={true}/>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default CourseList;
