import { Box, Button, IconButton, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
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
import AddGroupLineModal from "./AddGroupLineModal";
import AddIcon from '@mui/icons-material/Add';

const GroupLineData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const { data: mainData } = hookContainer('/get-group');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.groupline_name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'groupline_name', headerName: 'Group Line Name', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.groupline_name}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (data) => {
                const SelectData = () => {
                    const obj = {
                        id: data.row.id,
                        groupline_name: data.row.groupline_name,
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

    const openAddGroupLineModal = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
    }

    const refreshData = () => queryClient.invalidateQueries(['/get-group']);

    const selectToDelete = (data) => {
        setSelectedID(data);
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }

    const deleteData = useMutation({
        mutationFn: () => http.delete(`/remove-group?id=${selectedID}`),
        onSuccess: () => {
            toast.success('Data has been deleted successfully.');
            queryClient.invalidateQueries(['/get-group']);
            dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
        }
    });

    const DeleteData = () => {
        deleteData.mutate(selectedID);
    };

    return (
        <>
            <AddGroupLineModal RefreshData={refreshData} />
            <DeleteSwal maxWidth="xs" onClick={DeleteData} />
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button startIcon={<AddIcon />} variant="contained" onClick={openAddGroupLineModal}>ADD NEW</Button>
                </Stack>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={450}
                    height={450}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                    disableRowSelectionOnClick={true}
                />
            </Paper>
        </>
    )
}

export default GroupLineData