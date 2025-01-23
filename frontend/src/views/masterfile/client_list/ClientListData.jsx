import { Box, Button, IconButton, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL, OPEN_DELETESWAL, FORM_DATA } from "../../../store/actions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import http from "../../../api/http";
import { toast } from "sonner";
import AddClientListModal from "./AddClientListModal";

const ClientListData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const { data: mainData } = hookContainer('/get-client');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.client_name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'client_code', headerName: 'Code', width: 200,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_code}
                </Box>
            ),
        },
        {
            field: 'client_name', headerName: 'Client Name', width: 280,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_name}
                </Box>
            ),
        },
        {
            field: 'client_address', headerName: 'Address', width: 300,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_address}
                </Box>
            ),
        },
        {
            field: 'client_contactno', headerName: 'Contact No', width: 220,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_contactno}
                </Box>
            ),
        },
        {
            field: 'client_email', headerName: 'Email', width: 230,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_email}
                </Box>
            ),
        },
        {
            field: 'client_tinno', headerName: 'TIN No', width: 230,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.client_tinno}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 80,
            align: 'right',
            renderCell: (data) => {
                const SelectData = () => {
                    const obj = {
                        id: data.row.id,
                        client_code: data.row.client_code,
                        client_name: data.row.client_name,
                        client_address: data.row.client_address,
                        client_contactno: data.row.client_contactno,
                        client_email: data.row.client_email,
                        client_tinno: data.row.client_tinno,
                    };
                    dispatch({ type: FORM_DATA, formData: obj });
                    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
                    dispatch({ type: IS_UPDATE_FORM, isUpdateForm: true });
                };
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <IconButton color="primary" size="small" onClick={SelectData}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => selectToDelete(data.row.id)}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                )
            }
        }
    ];

    const openAddClientListModal = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
    }

    const refreshData = () => queryClient.invalidateQueries(['/get-client']);

    const selectToDelete = (data) => {
        setSelectedID(data);
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }

    const deleteData = useMutation({
        mutationFn: () => http.delete(`/remove-client?id=${selectedID}`),
        onSuccess: () => {
            toast.success('Data has been deleted successfully.');
            queryClient.invalidateQueries(['/get-client']);
            dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
        }
    });

    const DeleteData = () => {
        deleteData.mutate(selectedID);
    };

    return (
        <>
            <AddClientListModal RefreshData={refreshData} />
            <DeleteSwal maxWidth="xs" onClick={DeleteData} />
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" onClick={openAddClientListModal}>Add Day Type</Button>
                </Stack>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={450}
                    height={450}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                />
            </Paper>
        </>
    )
}

export default ClientListData