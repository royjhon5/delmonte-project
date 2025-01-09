import React, { useState } from 'react';
import { DepartmentData } from '../data/data';
import useDialogState from '@/hooks/use-dialog-state';

type DepartmentDialogType = 'add' | 'edit' | 'delete' | 'confirm'

interface DepartmentContextType {
    open: DepartmentDialogType | null
    setOpen: (str: DepartmentDialogType | null) => void
    currentRow: DepartmentData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<DepartmentData | null>>
}

const DepartmentContext = React.createContext<DepartmentContextType | null>(null)

interface Props {
    children: React.ReactNode;
}

export default function DepartmentProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<DepartmentDialogType>(null);
    const [currentRow, setCurrentRow] = useState<DepartmentData | null>(null);

    return (
        <DepartmentContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </DepartmentContext.Provider>
    );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useDepartment = () => {
    const context = React.useContext(DepartmentContext);
    if (!context) {
        throw new Error('useDepartment must be used within a <DepartmentProvider>');
    }   
    return context;
};