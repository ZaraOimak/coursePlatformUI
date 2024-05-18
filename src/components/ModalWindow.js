import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ModalWindow = ({ open, handleClose, title, children, onSave }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="custom-dialog-title"
            sx={{ '& .MuiDialog-paper': { minWidth: '600px', borderRadius: '8px' } }}
        >
            <DialogTitle id="custom-dialog-title" sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '8px', paddingBottom: '24px' }}>
                {children}
            </DialogContent>
            <DialogActions sx={{ padding: '8px 24px' }}>
                <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none' }}>
                    Отмена
                </Button>
                <Button onClick={onSave} color="primary" sx={{ textTransform: 'none' }}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalWindow;
