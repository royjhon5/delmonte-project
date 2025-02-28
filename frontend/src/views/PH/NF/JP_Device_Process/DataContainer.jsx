import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import { toast } from "sonner";
import http from "../../../../api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from 'dayjs'
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const DataContainer = () => {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const { data: mainData, isLoading } = hookContainer('/get-employeemasterfile');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.EmpID };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.FName.toLowerCase().includes(search.toLowerCase()) ||
            row.MName.toLowerCase().includes(search.toLowerCase()) ||
            row.LName.toLowerCase().includes(search.toLowerCase()) ||
            row.ChapaID_Old.toLowerCase().includes(search.toLowerCase())
        );
    };
    
    // Mutation for updating data
    const saveData = useMutation({
        mutationFn: (data) => http.post('/save-employeemasterfile', data),
        onSuccess: () => {
            toast.success('Data has been updated successfully.');
            queryClient.invalidateQueries(['/get-employeemasterfile']); // Refetch data after update
        },
        onError: (error) => {
            toast.error('Failed to update data.');
            console.error('Error saving:', error);
            
        }
    });

    // Function to handle update
    const handleUpdate = (row) => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        const DataToSave = {
            EmpID: row.EmpID,
            IsPH: row.IsPH === 1 ? 0 : 1,
            DateSetPHEmployee: row.IsPH === 1 ? '' : currentDate 
        };

        saveData.mutate(DataToSave);
    };

    const ColumnHeader = [
        {
            field: 'ChapaID_Old ', headerName: 'Chapa ID', width: 150,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.ChapaID_Old }
                </Box>
            ),
        },
        {
            field: 'FName', headerName: 'Full Name', width: 800,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.FName} {data.row.MName} {data.row.LName}
                </Box>
            ),
        },
        {
            field: 'EmployeeStatus', headerName: 'Status', width: 150,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    <Chip label={data.row.EmployeeStatus} size="small" color="primary" /> 
                </Box>
            ),
        },
        {
            field: 'IsPH', headerName: 'Is Packhouse Employee?', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.IsPH === 1 ? <Chip label="Yes" size="small" color="primary" /> : <Chip label="No" size="small" color="error" />} 
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 250,
            align: 'right',
            renderCell: (data) => {
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button variant="contained" color={data.row.IsPH === 1 ? "error" : "primary"} size="small" onClick={() => handleUpdate(data.row)}>
                            {data.row.IsPH === 1 ? "Unset Packhouse Employee" : "Set As Packhouse Employee"}
                        </Button>
                    </Box>
                )
            }
        }
    ];
    const [dateFrom, setDateFrom] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateTo, setDateTo] = useState(dayjs().format('YYYY-MM-DD'));
    const exportData = async () => {
        window.open(`http://192.168.1.10:8000/api/export-packhouse-employee?fromDate=${dateFrom}&toDate=${dateTo}`)        
    };

    const exportForEmployeeList = async () => {
        window.open(`http://192.168.1.10:8000/api/export-for-employeelist?fromDate=${dateFrom}&toDate=${dateTo}`);
    };

    return (
        <>
            <Paper>
                <Stack sx={{ display: 'flex', paddingLeft: '20px', paddingTop: '20px', paddingRight: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '20%', lg: '20%' } }} />
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',gap: 1 }}>
                        <Box sx={{ display: 'flex' , flexDirection: 'row', gap: 1}}>
                            <TextField type="date" size="small" label="Filter date to export FROM" value={dateFrom} onChange={(e) => {setDateFrom(e.target.value)}} />
                            <TextField type="date" size="small" label="TO" value={dateTo} onChange={(e) => {setDateTo(e.target.value)}} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1}}>
                            <Button startIcon={<FileDownloadIcon />} variant="contained" size="small" color="warning" onClick={exportForEmployeeList}>EXPORT DATA FOR MASTFILE EMPLOYEE LIST</Button>
                            <Button startIcon={<FileDownloadIcon />} variant="contained" size="small" color="info" onClick={exportData}>EXPORT DATA FOR FACE BIO DEVICE</Button>
                        </Box>
                    </Box>  
                </Stack>
                <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight:'20px', paddingBottom:'15px', paddingTop:'5px'}}>
                    <Typography fontSize={12} textAlign={"justify"}>Note: If you are going to import data into the face bio device and the master employee list, please export only the data set today to avoid conflicts.</Typography>
                </Stack>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={650}
                    height={600}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                    loading={isLoading}
                    disableRowSelectionOnClick={true}
                />
            </Paper>
        </>
    )
}

export default DataContainer