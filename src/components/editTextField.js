import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

const EditableTextField = ({ name, value, onValueChange, placeholder, multiline = false, rows = 1, fullWidth = true }) => {
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
            }}
        >
            <TextField
                variant="outlined"
                name={name}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
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
                        autoComplete: "new-password"
                    }
                }}
            />
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
