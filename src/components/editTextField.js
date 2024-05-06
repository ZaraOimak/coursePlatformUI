import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

const EditableTextField = ({ value, onChange, placeholder, multiline = false, rows = 1, fullWidth = true }) => {
    const [hover, setHover] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                position: 'relative',
                '&:hover': {
                    backgroundColor: hover ? '#f0f0f0' : 'inherit', // серый фон при наведении
                }
            }}
        >
            <TextField
                variant="outlined"
                value={value}
                onChange={onChange}
                placeholder={placeholder}  // Используем placeholder для отображения внутри поля
                multiline={multiline}
                rows={multiline ? rows : 1}
                fullWidth={fullWidth}
                InputProps={{
                    sx: {
                        border: 'none', // убираем рамку
                        '&:hover': {
                            border: 'none' // убираем рамку при наведении
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none' // убираем рамку
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none', // убираем рамку при фокусе
                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)' // добавляем тень для выделения при фокусе
                        },
                        autoComplete: "new-password"  // отключаем автозаполнение
                    }
                }}
                sx={{
                    backgroundColor: hover ? '#f0f0f0' : 'inherit', // серый фон при наведении
                }}
            />
            {hover && (
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'action.active',
                    }}
                >
                    <EditIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default EditableTextField;
