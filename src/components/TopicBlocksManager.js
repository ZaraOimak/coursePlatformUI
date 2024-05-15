import React from 'react';
import {Box, Button, MenuItem, TextField} from '@mui/material';
import ReactPlayer from 'react-player';
import MDEditor from '@uiw/react-md-editor'; // Импортируем Markdown редактор

const TopicBlocksManager = ({ blocks, setBlocks }) => {
    // Добавляем обработчики и логику как описано выше...
    const handleAddBlock = () => {
        const newBlock = {
            name: '',
            resources: [{ resourceType: 'TEXT', content: '' }]
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleRemoveBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        setBlocks(newBlocks);
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

    const handleAddResource = (blockIndex) => {
        const updatedBlocks = blocks.map((block, idx) => {
            if (idx === blockIndex) {
                const newResource = { resourceType: 'TEXT', content: '' };
                return { ...block, resources: [...block.resources, newResource] };
            }
            return block;
        });
        setBlocks(updatedBlocks);
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
                    <div>
                        <TextField
                            fullWidth
                            label="URL изображения"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, 'content', e.target.value)}
                            margin="normal"
                        />
                        {resource.content &&
                            <img src={resource.content} alt="Preview" style={{maxWidth: '100%', marginTop: '10px'}}/>}
                    </div>
                );
            case 'VIDEO':
                return (
                    <div>
                        <TextField
                            fullWidth
                            label="URL видео"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(blockIndex, index, 'content', e.target.value)}
                            margin="normal"
                        />
                        {resource.content &&
                            <ReactPlayer url={resource.content} controls width="100%" style={{marginTop: '10px'}}/>}
                    </div>
                );
            case 'TEXT':
                return (
                    <MDEditor
                        value={resource.content}
                        data-color-mode="light"
                        onChange={(value) => handleResourceChange(blockIndex, index, 'content', value)}
                        height={600}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box>
            {blocks.map((block, blockIndex) => (
                <Box key={blockIndex} sx={{p: 2, borderRadius: '5px'}}>
                    <TextField
                        label="Название блока"
                        fullWidth
                        value={block.name}
                        onChange={(e) => handleChangeBlockName(blockIndex, e.target.value)}
                    />
                    {block.resources.map((resource, resIndex) => (
                        <Box key={resIndex} sx={{mt: 3, mb: 3}}>
                            <TextField
                                select
                                label="Тип ресурса"
                                sx={{mb: 4}}
                                fullWidth
                                value={resource.resourceType}
                                onChange={(e) => handleResourceChange(blockIndex, resIndex, 'resourceType', e.target.value)}
                            >
                                <MenuItem value="TEXT">Текст</MenuItem>
                                <MenuItem value="IMAGE">Изображение</MenuItem>
                                <MenuItem value="VIDEO">Видео</MenuItem>
                            </TextField>
                            {renderResourceInput(resource, resIndex, blockIndex)}
                            <Button onClick={() => handleRemoveResource(blockIndex, resIndex)}>Удалить ресурс</Button>
                            <Button onClick={() => handleAddResource(blockIndex)}>Добавить ресурс</Button>
                        </Box>
                    ))}
                    <Button onClick={() => handleRemoveBlock(blockIndex)}>Удалить блок</Button>
                </Box>
            ))}
            <Button onClick={handleAddBlock}>Добавить блок</Button>
        </Box>
    );
};

export default TopicBlocksManager;
