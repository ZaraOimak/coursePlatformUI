import React, {useState} from 'react';
import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import ReactPlayer from 'react-player';
import MDEditor from '@uiw/react-md-editor';
import MenuTypeSelector from './MenuTypeSelector';
import addNewCourse from '../resources/add_circle.svg';
import ModalWindow from './ModalWindow';
import deleteCourseIcon from "../resources/delete.svg";

const TopicBlocksManager = ({ blocks, setBlocks }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentBlockIndex, setCurrentBlockIndex] = useState(null);
    const [currentResourceIndex, setCurrentResourceIndex] = useState(null);
    const [url, setUrl] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const handleAddBlock = () => {
        const newBlock = {
            name: '',
            resources: [{resourceType: 'TEXT', content: ''}],
            position: blocks.length ? Math.max(...blocks.map(block => block.position)) + 1 : 0,
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleRemoveBlock = () => {
        if (currentBlockIndex !== null) {
            const newBlocks = blocks.filter((_, i) => i !== currentBlockIndex);
            setBlocks(newBlocks);
            setCurrentBlockIndex(null);
            setDeleteConfirmationOpen(false);
        }
    };

    const handleChangeBlockName = (index, value) => {
        const updatedBlocks = blocks.map((block, idx) => {
            if (idx === index) {
                return { ...block, name: value };
            }
            return block;
        });
        setBlocks(updatedBlocks);
    };

    const handleResourceChange = (blockIndex, resourceIndex, field, value) => {
        const updatedBlocks = blocks.map((block, idx) => {
            if (idx === blockIndex) {
                const updatedResources = block.resources.map((resource, rIdx) => {
                    if (rIdx === resourceIndex) {
                        return { ...resource, [field]: value };
                    }
                    return resource;
                });
                return { ...block, resources: updatedResources };
            }
            return block;
        });
        setBlocks(updatedBlocks);
    };

    const handleAddResource = (blockIndex, resourceType) => {
        const updatedBlocks = blocks.map((block, idx) => {
            if (idx === blockIndex) {
                const newResource = {
                    resourceType,
                    content: '',
                    position: block.resources.length ? Math.max(...block.resources.map(res => res.position)) + 1 : 0,
                };
                return { ...block, resources: [...block.resources, newResource] };
            }
            return block;
        });
        setBlocks(updatedBlocks);

        if (resourceType === 'IMAGE' || resourceType === 'VIDEO') {
            setModalOpen(true);
            setModalTitle(resourceType === 'IMAGE' ? 'Добавить изображение' : 'Добавить видео');
            setCurrentBlockIndex(blockIndex);
            setCurrentResourceIndex(updatedBlocks[blockIndex].resources.length - 1);
        }
    };

    const handleSaveUrl = () => {
        if (currentBlockIndex !== null && currentResourceIndex !== null) {
            handleResourceChange(currentBlockIndex, currentResourceIndex, 'content', url);
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

    const handleRemoveResource = (blockIndex, resourceIndex) => {
        const updatedBlocks = blocks.map((block, idx) => {
            if (idx === blockIndex) {
                const newResources = block.resources.filter((_, rIdx) => rIdx !== resourceIndex);
                return { ...block, resources: newResources };
            }
            return block;
        });
        setBlocks(updatedBlocks);
    };

    const renderResourceInput = (resource, index, blockIndex) => {
        switch (resource.resourceType) {
            case 'IMAGE':
                return (
                    <Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <TextField
                            fullWidth
                            label="URL изображения"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, 'content', e.target.value)}
                            margin="normal"
                        />
                        {resource.content && (
                            <img src={resource.content} alt="Preview" style={{maxWidth: '100%', marginTop: '10px'}}/>
                        )}
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                    </Box>
                );
            case 'VIDEO':
                return (
                    <Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <TextField
                            fullWidth
                            label="URL видео"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, 'content', e.target.value)}
                            margin="normal"
                        />
                        {resource.content && (
                            <div style={{position: 'relative', width: '100%', paddingTop: '56.25%'}}>
                                <ReactPlayer
                                    url={resource.content}
                                    style={{position: 'absolute', top: 0, left: 0}}
                                    width="100%"
                                    height="100%"
                                    controls
                                />
                            </div>
                        )}
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                    </Box>
                );
            case 'TEXT':
                return (
                    <Box sx={{backgroundColor: 'white', p: 2, pb: 8, borderRadius: '4px', position: 'relative'}}>
                        <MDEditor
                            value={resource.content}
                            data-color-mode="light"
                            onChange={(value) => handleResourceChange(blockIndex, index, 'content', value)}
                            height={200}
                        />
                        <IconButton
                            onClick={() => handleRemoveResource(blockIndex, index)}
                            sx={{position: 'absolute', bottom: 8, right: 8}}
                        >
                            <img src={deleteCourseIcon} alt="delete icon" style={{width: '24px', height: '24px'}}/>
                        </IconButton>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            {blocks.map((block, blockIndex) => (
                <div>
                    <Box sx={{
                        backgroundColor: '#50F1BE',
                        width: 111,
                        height: 34,
                        borderRadius: '1px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                    }}>
                        <Typography variant="h6" sx={{color: 'black', fontSize: '18px', lineHeight: '34px'}}>
                            Раздел {blockIndex + 1}
                        </Typography>
                    </Box>
                    <Box key={blockIndex} sx={{
                        borderLeft: '7px solid #50F1BE',
                        borderTop: '7px solid #50F1BE',
                        mb: 4,
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

                    {block.resources.map((resource, resIndex) => (
                        <Box key={resIndex} sx={{mt: 3, mb: 3}}>
                            {renderResourceInput(resource, resIndex, blockIndex)}
                        </Box>
                    ))}
                        <MenuTypeSelector
                            onResourceTypeChange={(type) => handleAddResource(blockIndex, type)}
                        />
                </Box>
                </div>
            ))}
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
                <IconButton
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                >
                    <img src={addNewCourse} alt="update course icon"/>
                </IconButton>
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
    );
};

export default TopicBlocksManager;
