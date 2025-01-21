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
import AddLocationListModal from "./AddLocationListModal";

const LocationListData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const { data: mainData } = hookContainer('/get-location');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.location_name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'location_name', headerName: 'Location Name', width: 900,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.location_name}
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
                        location_name: data.row.location_name,
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

    const openAddLocationListModal = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
    }

    const refreshData = () => queryClient.invalidateQueries(['/get-location']);

    const selectToDelete = (data) => {
        setSelectedID(data);
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }

    const deleteData = useMutation({
        mutationFn: () => http.delete(`/remove-location?id=${selectedID}`),
        onSuccess: () => {
            toast.success('Data has been deleted successfully.');
            queryClient.invalidateQueries(['/get-location']);
            dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
        }
    });

    const DeleteData = () => {
        deleteData.mutate(selectedID);
    };

    return (
        <>
            <AddLocationListModal RefreshData={refreshData} />
            <DeleteSwal maxWidth="xs" onClick={DeleteData} />
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" onClick={openAddLocationListModal}>Add Group Line</Button>
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

export default LocationListData