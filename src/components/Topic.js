import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";
import MarkdownIt from 'markdown-it';
import ReactPlayer from "react-player";

const Topic = ({topic, courseUuid}) => {
    const navigate = useNavigate();
    const buttonSx = {
        textTransform: 'none',
        fontSize:16,
        borderRadius: '15px',
        padding: '24px 20px',
        ':hover': {
            backgroundColor: (theme) => theme.palette.success.main,
            filter: 'brightness(110%)',
        },
        ':disabled': {
            backgroundColor: '#CAC4D0',
            color: 'black',
        },
        minWidth: 'fit-content',
        color: 'black',
    };

    const onPrevious = () => {
        if (topic.previousTopicUuid) {
            navigate(`/course/${courseUuid}/topic/${topic.previousTopicUuid}`);
        }
    };

    const onNext = () => {
        if (topic.nextTopicUuid) {
            navigate(`/course/${courseUuid}/topic/${topic.nextTopicUuid}`);
        }
    };


    const mdParser = new MarkdownIt();

    return (
        <div style={{backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px'}}>
            <Container>
                <Typography variant="h4" gutterBottom>
                    {topic.name}
                </Typography>
                <Typography>
                    {topic.description}
                </Typography>
                {topic.blocks.map((block, index) => (
                    <Box key={index} sx={{my: 4}}>
                        <Typography variant="h6" gutterBottom>
                            {block.name}
                        </Typography>
                        <Box sx={{backgroundColor: '#e3edf8', p: 2, my: 2}}>
                            {block.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex}>
                                    {resource.resourceType === 'TEXT' && (
                                        <div dangerouslySetInnerHTML={{ __html: mdParser.render(resource.content) }} />
                                    )}
                                    {resource.resourceType === 'IMAGE' && (
                                        <img src={resource.content} alt={`Resource ${resourceIndex}`}
                                             style={{width: '100%', height: 'auto'}}/>
                                    )}
                                    {resource.resourceType === 'VIDEO' && (
                                        <div style={{ position: 'relative',width:'100%',height:'100%'}}>
                                            <ReactPlayer
                                                url={resource.content}
                                                width="100%"
                                                height="100%"
                                                controls
                                            />
                                        </div>
                                    )}


                                </div>
                            ))}
                        </Box>
                    </Box>
                ))}
                <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                    <Button
                        onClick={onPrevious}
                        disabled={!topic.previousTopicUuid}
                        sx={{
                            ...buttonSx,
                            backgroundColor: topic.previousTopicUuid ? '#50F1BE' : undefined,
                        }}
                    >
                        Предыдущий урок
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!topic.nextTopicUuid}
                        sx={{
                            ...buttonSx,
                            backgroundColor: topic.nextTopicUuid ? '#50F1BE' : undefined,
                        }}
                    >
                        Следующий урок
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default Topic;
