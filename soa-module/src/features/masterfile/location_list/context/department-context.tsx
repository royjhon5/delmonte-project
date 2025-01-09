import React, { useState } from 'react';
import { LocationData } from '../data/data';
import useDialogState from '@/hooks/use-dialog-state';

type LocationDialogType = 'add' | 'edit' | 'delete' | 'confirm'

interface LocationContextType {
    open: LocationDialogType | null
    setOpen: (str: LocationDialogType | null) => void
    currentRow: LocationData | null
    setCurrentRow: React.Dispatch<React.SetStateAction<LocationData | null>>
}

const LocationContext = React.createContext<LocationContextType | null>(null)

interface Props {
    children: React.ReactNode;
}

export default function DepartmentProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<LocationDialogType>(null);
    const [currentRow, setCurrentRow] = useState<LocationData | null>(null);

    return (
        <LocationContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </LocationContext.Provider>
    );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useLocation = () => {
    const context = React.useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a <LocationProvider>');
    }   
    return context;
};