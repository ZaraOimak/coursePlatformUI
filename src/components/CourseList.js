import { useEffect, useState } from "react";
import { Container, Grid, Typography } from '@mui/material';
import { fetchCourses } from "../api/coursesApi";
import Footer from '../pages/Footer';
import Header from '../pages/Header';
import CourseCard from './CourseCard';

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchAndSetCourses = async () => {
            const response = await fetchCourses();
            const authorUUID = localStorage.getItem('authorUUID');
            const filteredCourses = authorUUID ? response.data.filter(course => course.authorUuid === authorUUID) : response.data;
            setCourses(filteredCourses);
        };

        fetchAndSetCourses();
    }, []);
    return (
        <>
            <Header />
            <div className="main-container" style={{ backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px' }}>
                <Container>
                    <Typography variant="h3" className="text-start mt-5 mb-5">Мои онлайн курсы</Typography>
                    <Grid container sx={{ width: 1060 }}>
                        {courses.map((course, index) => (
                            <Grid item key={course.uuid} sx={{ marginTop: '30px', marginRight: '20px' }}>
                                <CourseCard course={course} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default CourseList;
