import { Box, Button, Chip, Paper, Stack, TextField } from "@mui/material"
import { useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import { toast } from "sonner";
import http from "../../../../api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        const DataToSave = {
            EmpID: row.EmpID,
            IsPH: row.IsPH === 1 ? 0 : 1,
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

    const exportData = async () => {
        window.open("http://localhost:8000/api/export-packhouse-employee")        
    };

    return (
        <>
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" onClick={exportData}>Export Data</Button>
                </Stack>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={450}
                    height={450}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                    loading={isLoading}
                />
            </Paper>
        </>
    )
}

export default DataContainer