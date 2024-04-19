import React from 'react';
import {Box, Container, Typography} from '@mui/material';
import ReactMarkdown from 'react-markdown';

const Topic = ({topic}) => {

    return (
        <>
            <div className="main-container"
                 style={{backgroundColor: '#e3edf8', minHeight: 'calc(100vh - 100px)', paddingBottom: '100px'}}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        {topic.name}
                    </Typography>

                    <ReactMarkdown>
                        {">Вторая строка цитаты. *Это курсив*  ###Заголовок 1 ![Alt-текст](https://masterpiecer-images.s3.yandex.net/37d9d9d5799f11ee99fbbadf81d486ab:upscaled)"}
                    </ReactMarkdown>

                    <ReactMarkdown>
                        {topic.description}
                    </ReactMarkdown>
                    {topic.blocks.map((block, index) => (
                        <Box key={index} sx={{my: 4}}>
                            <Typography variant="h6" gutterBottom>
                                {block.name}
                            </Typography>
                            <Box sx={{backgroundColor: '#e3edf8', p: 2, my: 2}}>
                                {block.resources.map((resource, resourceIndex) => (
                                    <div key={resourceIndex}>
                                        {resource.resourceType === 'TEXT' && (
                                            <ReactMarkdown>
                                                {resource.content}
                                            < /ReactMarkdown>
                                        )}
                                        {resource.resourceType === 'IMAGE' && (
                                            <img src={resource.content} alt={`Resource ${resourceIndex}`}
                                                 style={{width: '100%', height: 'auto'}}/>
                                        )}
                                        {resource.resourceType === 'VIDEO' && (
                                            <iframe width="560" height="315"
                                                    src={resource.content}
                                                    title="YouTube video player" frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen></iframe>
                                        )}
                                    </div>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Container>
            </div>
        </>
    );
};

export default Topic;
