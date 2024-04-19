import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({ onClick, children }) => {
    return (
        <Button
            variant="outline-info"
            className="mt-2 mt-md-0"
            style={{
                height: '53px',
                maxWidth: '153px',
                minWidth: '153px',
                backgroundColor: '#50F1BE',
                borderColor: '#50F1BE',
                borderRadius: '15px',
                color: 'black',
                marginRight: '20px'
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

export default CustomButton;
