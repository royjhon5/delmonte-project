import { Box, Button, IconButton, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IS_UPDATE_FORM, OPEN_DELETESWAL, FORM_DATA, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import http from "../../../api/http";
import { toast } from "sonner";
import AddEmployeeListModal from "./AddEmployeeListModal";

const EmployeeListData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const { data: mainData } = hookContainer('/get-employee');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.chapa_id.toLowerCase().includes(search.toLowerCase()) ||
            row.firstname.toLowerCase().includes(search.toLowerCase()) ||
            row.lastname.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'chapa_id', headerName: 'Chapa ID', width: 200,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.chapa_id}
                </Box>
            ),
        },
        {
            field: 'fullname', headerName: 'Fullname', width: 250,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.firstname + " " + data.row.middlename + " " + data.row.lastname + " " + data.row.extname}
                </Box>
            ),
        },
        {
            field: 'location_name', headerName: 'Location', width: 250,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.location_name}
                </Box>
            ),
        },
        {
            field: 'department_name', headerName: 'Department', width: 250,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.department_name}
                </Box>
            ),
        },
        {
            field: 'groupline_name', headerName: 'Group', width: 250,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.groupline_name}
                </Box>
            ),
        },
        {
            field: 'activityname', headerName: 'Activity', width: 250,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.activityname}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 70,
            align: 'right',
            renderCell: (data) => {
                const SelectData = () => {
                    const obj = {
                        id: data.row.id,
                        chapa_id: data.row.chapa_id,
                        firstname: data.row.firstname,
                        lastname: data.row.lastname,
                        middlename: data.row.middlename,
                        extname: data.row.extname,
                        assigned_location_idlink: data.row.assigned_location_idlink,
                        assigned_department_idlink: data.row.assigned_department_idlink,
                        assigned_group_idlink: data.row.assigned_group_idlink,
                        default_activity_idlink: data.row.default_activity_idlink,
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

    const openAddEmployeeListModal = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
    }

    const refreshData = () => queryClient.invalidateQueries(['/get-employee']);

    const selectToDelete = (data) => {
        setSelectedID(data);
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }

    const deleteData = useMutation({
        mutationFn: () => http.delete(`/remove-group?id=${selectedID}`),
        onSuccess: () => {
            toast.success('Data has been deleted successfully.');
            queryClient.invalidateQueries(['/get-employee']);
            dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
        }
    });

    const DeleteData = () => {
        deleteData.mutate(selectedID);
    };

    return (
        <>
            <AddEmployeeListModal RefreshData={refreshData} />
            <DeleteSwal maxWidth="xs" onClick={DeleteData} />
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" onClick={openAddEmployeeListModal}>Add Employee</Button>
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

export default EmployeeListData