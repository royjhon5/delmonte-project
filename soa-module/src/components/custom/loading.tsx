import { CircularProgress } from '@mui/material';
import React from 'react';

interface LoadingProps {
    message?: string; 
}

const CustomLoading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 h-full">
            <CircularProgress size="30px" />
            {message}
        </div>
    );
};

export default CustomLoading;
