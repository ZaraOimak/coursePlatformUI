import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import React, { Component } from 'react';
import cardCover from '../resources/Card cover.png';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: []
        };
    }

    addCourse = () => {
        const newCourse = {
            title: `Новый курс ${this.state.courses.length + 1}`,
            author: `Автор курса ${this.state.courses.length + 1}`
        };
        this.setState(prevState => ({
            courses: [...prevState.courses, newCourse]
        }));
    }

    render() {
        return (
            <div className="main-container" style={{ backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)' }}>
                <Container>
                    <Typography variant="h3" className="text-start mt-5 mb-5">Все онлайн курсы</Typography>
                    <Grid container sx={{width:1060}}>
                        {this.state.courses.map((course, index) => (
                            <Grid item key={index} sx={{ marginTop: '30px', marginRight: '20px' }}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={cardCover}
                                        alt="Course Cover"
                                        sx={{ height: 130, width: 245 }}
                                    />
                                    <CardContent sx={{ height: 130, width: 245 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Основы веб-разработки
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Иван Иванов
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container justifyContent="center" className="mt-5 mb-4">
                        <Button variant="contained" color="primary" onClick={this.addCourse}>Добавить курс</Button>
                    </Grid>
                </Container>
            </div>
        )
    }
}