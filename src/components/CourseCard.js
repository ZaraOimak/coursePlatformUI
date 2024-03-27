import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import cardCover from '../resources/Card cover.png';

const CourseCard = ({course}) => {
    const navigate = useNavigate()
    const openCourse = () => {
        navigate(`/course/${course.uuid}`)
    };

    return <Card>
        <CardActionArea onClick={openCourse}>
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
            </CardContent>
        </CardActionArea>
    </Card>
}

export default CourseCard;