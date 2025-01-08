import React, { useContext, useState } from 'react';

type DepartmentDialogType = 'add' | 'edit' | 'delete';

interface DepartmentContextType {
    open: DepartmentDialogType | null
    setOpen: (str: DepartmentDialogType | null) => void
    currentRow: DepartmentData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<DepartmentData | null>>
}

const DepartmentContext = React.createContext<DepartmentContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export default function DepartmentProvider({ children }: Props) {
    const [open, setOpen] = useState<DepartmentDialogType>(null);
    const [currentRow, setCurrentRow] = useState<DepartmentData | null>(null);

    return (
        <DepartmentContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </DepartmentContext.Provider>
    );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useDepartmentContext = () => {
    const context = useContext(DepartmentContext);
    if (context === undefined) {
        throw new Error('useDepartmentContext must be used within a DepartmentProvider');
    }
    return context;
};