import React from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
const TopicBlocksManager = ({ blocks, setBlocks }) => {
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

    return (
        <Box>
            {blocks.map((block, index) => (
                <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid grey', borderRadius: '5px' }}>
                    <TextField
                        label="Название блока"
                        fullWidth
                        value={block.name}
                        onChange={(e) => handleChangeBlockName(index, e.target.value)}
                        margin="normal"
                    />
                    {block.resources.map((resource, resIndex) => (
                        <Box key={resIndex} sx={{ mt: 1, mb: 1, p: 1, border: '1px dashed grey' }}>
                            <TextField
                                label="Тип ресурса"
                                fullWidth
                                select
                                SelectProps={{ native: true }}
                                value={resource.resourceType}
                                onChange={(e) => handleResourceChange(index, resIndex, 'resourceType', e.target.value)}
                                margin="normal"
                            >
                                <option value="TEXT">Текст</option>
                                <option value="IMAGE">Изображение</option>
                                <option value="VIDEO">Видео</option>
                            </TextField>
                            <TextField
                                label="Содержимое ресурса"
                                fullWidth
                                multiline
                                rows={3}
                                value={resource.content}
                                onChange={(e) => handleResourceChange(index, resIndex, 'content', e.target.value)}
                                margin="normal"
                            />
                            <Button onClick={() => handleRemoveResource(index, resIndex)} color="error">Удалить ресурс</Button>
                        </Box>
                    ))}
                    <Button onClick={() => handleAddResource(index)}>Добавить ресурс</Button>
                    <Button onClick={() => handleRemoveBlock(index)} color="error">Удалить блок</Button>
                </Box>
            ))}
            <Button onClick={handleAddBlock}>Добавить блок</Button>
        </Box>
    );
};

export default TopicBlocksManager;
