import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import mediaCard from '../resources/Media.png';
import {fetchAuthor} from "../api/authorsApi";
import {fetchCourse} from "../api/coursesApi";
import avatarImage from '../resources/authorAvatar.svg';
import TopicCard from "./TopicCard";

const Course = () => {
    const {uuid} = useParams();
    const [course, setCourse] = useState();
    const [author, setAuthor] = useState();

    useEffect(() => {
        let mounted = true;

        fetchCourse(uuid).then(courseData => {
            if (mounted) {
                setCourse(courseData);
                fetchAuthor(courseData.authorUuid).then(authorData => {
                    if (mounted) {
                        setAuthor(authorData);
                    }
                });
            }
        });
        return () => {
            mounted = false;
        };
    }, [uuid]);

    if (!course || !author) {
        return <div>Loading...</div>;
    }
    return (<>
        <Header/>
        <div className="main-container" style={{
            backgroundColor: '#e3edf8', paddingBottom: '100px', minHeight: 'calc(100vh - 100px)'
        }}>
            <Container>
                <Box sx={{display: 'flex', justifyContent: 'left', mb: 2}}>
                    <Typography variant="h5" gutterBottom>
                        ОСНОВЫ РАЗРАБОТКИ НА REACT: БАЗОВЫЙ КУРС
                    </Typography>
                </Box>


                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Card sx={{width: '35%', backgroundColor: "green", mr: 5}}>
                        <CardMedia
                            component="img"
                            image={mediaCard}
                            alt="Course Cover"
                            sx={{width: 415, height: 260}}
                        />
                    </Card>

                    <Box sx={{width: '50%', marginRight: 4, display: 'flex', flexDirection: 'column'}}>
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

                        <Typography variant="body2" color="text.secondary">
                            Курс состоит из 4 модулей по 10 уроков с упражнениями. Вы изучите базовый синтаксис
                            React и
                            создадите свой первый проект lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do
                            eiusmod tempor
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{mt: 4}}>
                    СТРУКТУРА КУРСА
                </Typography>
                <Card>
                    <CardContent>
                        {course.sections.map((section, sectionIndex) => (
                            <Accordion key={sectionIndex} sx={{marginBottom: 2}}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography variant="h6">{section.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{
                                        display: 'flex', flexWrap: 'wrap', justifyContent: "center", gap: 2
                                    }}>
                                        {section.topicsIds.map((topicUuid) => (
                                            <TopicCard courseUuid={uuid} topicUuid={topicUuid}/>))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>))}
                    </CardContent>
                </Card>
            </Container>
        </div>
        <Footer/>
    </>);
};


export default Course;
