import React from 'react';
import {IconButton, Tooltip} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const MenuTypeSelector = ({onResourceTypeChange}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: '#e0e0e0',
            padding: '10px',
            borderRadius: '8px',
            maxWidth:'204px',
            height: '56px'
        }}>
            <Tooltip title="Добавить изображение" placement="top">
                <IconButton
                    onClick={() => onResourceTypeChange('IMAGE')}
                    sx={{'&:hover': {backgroundColor: '#000', color: '#fff'}}}
                >
                    <ImageIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Добавить видео" placement="top">
                <IconButton
                    onClick={() => onResourceTypeChange('VIDEO')}
                    sx={{'&:hover': {backgroundColor: '#000', color: '#fff'}}}
                >
                    <VideoLibraryIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Добавить текст" placement="top">
                <IconButton
                    onClick={() => onResourceTypeChange('TEXT')}
                    sx={{'&:hover': {backgroundColor: '#000', color: '#fff'}}}
                >
                    <TextFieldsIcon/>
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default MenuTypeSelector;