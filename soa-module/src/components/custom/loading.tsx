import { CircularProgress } from '@mui/material';
import React from 'react';
import XSDotFlash from './xsDotFlash';

interface LoadingProps {
    message?: string; 
}

const CustomLoading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 h-full">
            <CircularProgress size="30px" />
            <p>{message} <XSDotFlash /> </p>
        </div>
    );
};

export default CustomLoading;
