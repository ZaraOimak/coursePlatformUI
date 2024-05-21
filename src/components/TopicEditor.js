import React, {useEffect, useState} from 'react';
import {Box, Button, Container, Icon, IconButton, TextField, Typography} from '@mui/material';
import ReactPlayer from 'react-player';
import MDEditor from '@uiw/react-md-editor';
import MenuTypeSelector from './MenuTypeSelector';
import addNewCourse from '../resources/add_circle.svg';
import ModalWindow from './ModalWindow';
import deleteCourseIcon from "../resources/delete.svg";
import {positionSort} from "../utils/commons";
import arrowBackIcon from "../resources/arrow_back.svg";
import EditableTextField from "./EditableTextField";
import {useNavigate} from "react-router-dom";
import {createOrUpdateTopic, deleteTopic} from "../api/topicsApi";

const TopicEditor = ({topic, courseUuid}) => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentBlockIndex, setCurrentBlockIndex] = useState(null);
    const [currentResourceIndex, setCurrentResourceIndex] = useState(null);
    const [url, setUrl] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [topicData, setTopicData] = useState({
        name: topic.name,
        uuid: topic.uuid,
        sectionUuid: topic.sectionUuid,
        description: topic.description,
        previousTopicUuid: topic.previousTopicUuid,
        nextTopicUuid: topic.nextTopicUuid,
        blocks: topic.blocks,
        position: topic.position,
    });

    useEffect(() => {
        setTopicData({...topic});
    }, [topic]);

    const handleSaveTopic = () => {
        try {
            createOrUpdateTopic(courseUuid, topicData).then(response => {
                console.log(response)
                if (!topicData.uuid) {
                    navigate(`/course/${courseUuid}/topic/edit/${response.data.uuid}`);
                }
            });
        } catch (error) {
            console.error('Ошибка при сохранении урока:', error);
        }
    };

    const handleDeleteTopic = () => {
        try {
            deleteTopic(courseUuid, topic.uuid).then(() => {
                console.log('Урок успешно удален.');
                navigate(`/course/edit/${courseUuid}`);
            });
        } catch (error) {
            console.error('Ошибка при удалении урока:', error);
        }
    };
    const handleAddBlock = () => {
        const newBlock = {
            name: '', resources: [{resourceType: 'TEXT', content: ''}]
        };
        const newTopic = {...topicData, blocks: [...topicData.blocks, newBlock]};
        createOrUpdateTopic(courseUuid, newTopic).then(setTopicData);
    };

    const handleRemoveBlock = () => {
        if (currentBlockIndex !== null) {
            topicData.blocks.splice(currentBlockIndex, 1);
            setCurrentBlockIndex(null);
            setDeleteConfirmationOpen(false);
            createOrUpdateTopic(courseUuid, topicData).then(setTopicData);
        }
    };

    const handleChangeBlockName = (index, value) => {
        setTopicData(prev => {
            prev.blocks[index].name = value;
            return {...prev};
        });
    };


    const handleResourceChange = (blockIndex, resourceIndex, value) => {
        setTopicData(prev => {
            prev.blocks[blockIndex].resources[resourceIndex].content = value;
            return {...prev};
        });
    };

    const handleAddResource = (blockIndex, resourceType) => {

            const block = topicData.blocks[blockIndex];
            block.resources.push({
                resourceType,
                content: '',
                position: block.resources.length ? Math.max(...block.resources.map(res => res.position)) + 1 : 0,
            });

            if (resourceType === 'IMAGE' || resourceType === 'VIDEO') {
                setModalOpen(true);
                setModalTitle(resourceType === 'IMAGE' ? 'Добавить изображение' : 'Добавить видео');
                setCurrentBlockIndex(blockIndex);
                setCurrentResourceIndex(block.resources.length - 1);
            }

            createOrUpdateTopic(courseUuid, topicData).then(setTopicData);
    };

    const handleRemoveResource = (blockIndex, resourceIndex) => {
        topicData.blocks[blockIndex].resources.splice(resourceIndex, 1);
        createOrUpdateTopic(courseUuid, topicData).then(setTopicData);
    };

    const handleDescriptionChange = (description) => {
        setTopicData(prev => ({...prev, description: description}));
    };

    const handleNameChange = (name) => {
        setTopicData(prev => ({...prev, name: name}));
    };

    const handleSaveUrl = () => {
        if (currentBlockIndex !== null && currentResourceIndex !== null) {
            handleResourceChange(currentBlockIndex, currentResourceIndex, url);
        }
        setModalOpen(false);
        setUrl('');
    };

    const handleCancelUrl = () => {
        if (currentBlockIndex !== null && currentResourceIndex !== null) {
            handleRemoveResource(currentBlockIndex, currentResourceIndex);
        }
        setModalOpen(false);
        setUrl('');
    };


    const renderResourceInput = (resource, index, blockIndex) => {
        switch (resource.resourceType) {
            case 'IMAGE':
                return (<Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <TextField
                            fullWidth
                            label="URL изображения"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, e.target.value)}
                            margin="normal"
                        />
                        {resource.content && (
                            <img src={resource.content} alt="Preview" style={{maxWidth: '100%', marginTop: '10px'}}/>)}
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                </Box>);
            case 'VIDEO':
                return (<Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <TextField
                            fullWidth
                            label="URL видео"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, e.target.value)}
                            margin="normal"
                        />
                    {resource.content && (<div style={{position: 'relative', width: '100%', paddingTop: '56.25%'}}>
                                <ReactPlayer
                                    url={resource.content}
                                    style={{position: 'absolute', top: 0, left: 0}}
                                    width="100%"
                                    height="100%"
                                    controls
                                />
                    </div>)}
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                </Box>);
            case 'TEXT':
                return (<Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <MDEditor
                            value={resource.content}
                            data-color-mode="light"
                            onChange={(value) => handleResourceChange(blockIndex, index, value)}
                            height={200}
                        />
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                </Box>);
            default:
                return null;
        }
    };


    return (<div className="main-container"
                 style={{backgroundColor: '#e3edf8', paddingBottom: '100px', minHeight: 'calc(100vh - 100px)'}}>
        <Container>
            <Box sx={{display: 'flex', alignItems: 'center', mt: 10, mb: 1}}>
                <IconButton onClick={() => navigate(`/course/edit/${courseUuid}`)} sx={{mr: 2}}>
                    <img src={arrowBackIcon} alt="Back to course" style={{width: '24px', height: '24px'}}/>
                </IconButton>

                <Box sx={{flex: 1}}>
                    <EditableTextField
                        name="name"
                        value={topicData.name}
                        onValueChange={handleNameChange}
                        placeholder="Название урока"
                        fullWidth={true}
                        multiline={true}
                        minRows={1}
                        maxRows={3}
                        variant="h4"
                    />
                </Box>

            </Box>
            <Box sx={{mb: 4}}>
                <EditableTextField
                    name="description"
                    value={topicData.description}
                    onValueChange={handleDescriptionChange}
                    placeholder="Описание урока"
                    multiline={true}
                    minRows={3}
                    maxRows={10}
                    fullWidth={true}
                    variant="h6"
                />
            </Box>
            <Box>
                {topicData.blocks.sort(positionSort).map((block, blockIndex) => (<div key={block.uuid}>
                    <Box sx={{
                        backgroundColor: '#50F1BE',
                        width: 130,
                        height: 34,
                        borderRadius: '4px 4px 0px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                    }}>
                        <Typography variant="h6" sx={{color: 'black', fontSize: '18px', lineHeight: '34px'}}>
                            Раздел {blockIndex + 1}
                        </Typography>
                    </Box>
                    <Box sx={{
                        borderLeft: '7px solid #50F1BE', borderTop: '7px solid #50F1BE', mb: 4,
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <Box sx={{
                                backgroundColor: 'white',
                                p: 2,
                                pb: 8,
                                borderRadius: '4px',
                                position: 'relative',
                                flex: 1
                            }}>
                                <TextField
                                    label="Название раздела"
                                    InputProps={{readOnly:false}}
                                    fullWidth
                                    value={block.name}
                                    onChange={(e) => handleChangeBlockName(blockIndex, e.target.value)}
                                />
                                <IconButton
                                    sx={{position: 'absolute', bottom: 8, right: 8}}
                                    onClick={() => {
                                        setCurrentBlockIndex(blockIndex);
                                        setDeleteConfirmationOpen(true);
                                    }}
                                >
                                    <img src={deleteCourseIcon} alt="delete course icon"
                                         style={{width: '24px', height: '24px'}}/>
                                </IconButton>
                            </Box>
                        </Box>

                        {block.resources.sort(positionSort).map((resource, resIndex) => {
                            return <Box key={resource.uuid} sx={{mt: 3, mb: 3}}>
                                {renderResourceInput(resource, resIndex, blockIndex)}
                            </Box>
                        })
                        }
                        <MenuTypeSelector
                            onResourceTypeChange={(type) => handleAddResource(blockIndex, type)}
                        />
                    </Box>
                </div>))}
                <Button onClick={handleAddBlock} style={{
                    width: '170px',
                    height: '56px',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderColor: 'gray',
                    borderRadius: '15px',
                    textAlign: 'center',
                    color: 'black',
                    position: 'relative',
                }}>
                    <Icon
                        sx={{
                            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)'
                        }}
                    >
                        <img src={addNewCourse} alt="update course icon"/>
                    </Icon>
                    Добавить раздел
                </Button>

                <ModalWindow
                    open={modalOpen}
                    handleClose={handleCancelUrl}
                    title={modalTitle}
                    onSave={handleSaveUrl}
                >
                    <TextField
                        fullWidth
                        label={modalTitle}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        margin="normal"
                    />
                </ModalWindow>

                <ModalWindow
                    open={deleteConfirmationOpen}
                    handleClose={() => setDeleteConfirmationOpen(false)}
                    title="Подтверждение удаления"
                    onSave={handleRemoveBlock}
                >
                    <p>Вы уверены, что хотите удалить весь раздел?</p>
                </ModalWindow>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', my: 4}}>
                <Button
                    onClick={handleDeleteTopic}
                    sx={{
                        textTransform: 'none',
                        fontSize: 16,
                        borderRadius: '15px',
                        padding: '24px 20px',
                        minWidth: 'fit-content',
                        color: 'black',
                        backgroundColor: '#CAC4D0',
                        '&:hover': {
                            backgroundColor: '#CAC4D0',
                            filter: 'brightness(110%)',
                        }
                    }}
                >
                    Удалить урок
                </Button>
                <Button
                    onClick={handleSaveTopic}
                    sx={{
                        textTransform: 'none',
                        fontSize: 16,
                        borderRadius: '15px',
                        padding: '24px 20px',
                        minWidth: 'fit-content',
                        color: 'black',
                        backgroundColor: '#50F1BE',
                        '&:hover': {
                            backgroundColor: '#50F1BE',
                            filter: 'brightness(110%)',
                        }
                    }}
                >
                    Сохранить урок
                </Button>
            </Box>
        </Container>
    </div>);
};

export default TopicEditor;
