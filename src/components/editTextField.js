import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EditableTextField = ({
                               name,
                               value,
                               onValueChange,
                               placeholder,
                               multiline = false,
                               minRows = 1,
                               maxRows = 6, // Новый пропс для максимального количества строк
                               fullWidth = true,
                               variant = 'body1', // Новый пропс для типографических вариантов
                               height = 'auto', // Пропс для высоты компонента
                               ...rest
                           }) => {
    const [active, setActive] = useState(false);

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);
    const handleFocus = () => setActive(true);
    const handleBlur = () => setActive(false);

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
                position: 'relative',
                backgroundColor: active ? '#f0f0f0' : 'inherit',
                height: height,
                width: '100%', // Занимаем всю ширину родительского контейнера
            }}
        >
            <Typography component="div" variant={variant} sx={{ width: '100%' }}>
                <TextField
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    placeholder={placeholder}
                    multiline={multiline}
                    minRows={minRows}
                    maxRows={maxRows}
                    fullWidth={fullWidth}
                    InputProps={{
                        sx: {
                            border: 'none',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)',
                            },
                            fontSize: 'inherit', // Устанавливаем размер текста в зависимости от Typography
                            height: '100%',
                        },
                        inputProps: {
                            style: { fontSize: 'inherit' },
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: 'inherit', // Устанавливаем размер текста для placeholder
                        },
                    }}
                    {...rest}
                />
            </Typography>
            {active && (
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
