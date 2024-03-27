import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import { fetchAuthor } from "../api/authorsApi";
import { fetchCourse } from "../api/coursesApi";
import Footer from '../pages/Footer';
import Header from '../pages/Header';
import cardCover from '../resources/Card cover.png';

const Course = () => {
    const { uuid } = useParams();
    const [course, setCourse] = useState()
    const [author, setAuthor] = useState()

    useEffect(() => {
        fetchCourse(uuid).then(courseData => {
            setCourse(courseData)
            fetchAuthor(courseData.authorUuid).then(author => {
                setAuthor(author)
            }, [])
        })
    }, [uuid]);

    if (!course || !author) {
        return <div>Loading...</div>
    }

    return <div>
        <Header />
        <Card>
            <CardMedia
                component="img"
                image={cardCover}
                alt="Course Cover"
                sx={{ height: 130, width: 245 }}
            />
            <CardContent sx={{ height: 130, width: 245 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {author.name}
                </Typography>
            </CardContent>
        </Card>
        <Footer />
    </div>
}


export default Course;