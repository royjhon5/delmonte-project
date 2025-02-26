import { Box, Button, FormControl, Grid, IconButton, InputLabel, ListItem, MenuItem, Paper, Select, Stack, TextField } from "@mui/material"
import { Fragment, useEffect, useState, useCallback } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hookContainer } from "../../../hooks/globalQuery";
import http from "../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPEN_CUSTOM_MODAL, OPEN_DELETESWAL, OPEN_CUSTOM_HEADER_MODAL, OPEN_CUSTOM_SEARCH_MODAL, SEARCH_SELECTED_DATA, FORM_HEADER_DATA, IS_UPDATE_HEADER_FORM, FORM_DATA, IS_UPDATE_FORM } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import HeaderModal from "./components/HeaderModal";
import DetailModal from "./components/DetailModal";
import SearchHeaderModal from "./components/SearchHeaderModal";

const AccountMasterData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: {} });
    }, []);
    const defaultHeaderData = {
        id: '',
        client_name: '',
        location: '',
        department: '',
    }
    const [headerData, setHeaderData] = useState(defaultHeaderData);
    const headerDataSelected = useSelector((state) => state.customization.searchSelectedData);
    useEffect(() => {
        if (headerDataSelected.id) {
            setHeaderData(headerDataSelected);
            loadEmployeeTemplateDetail(headerDataSelected.id);
        } else {
            setHeaderData(defaultHeaderData);
        }
    }, [headerDataSelected])

    const [constMappedData, setConstMappedData] = useState([]);
    const loadEmployeeTemplateDetail = useCallback(async (headerID = 0) => {
        if (headerID == 0) return setConstMappedData([]);
        const response = await http.get(`/get-accounttocharge?header_id=${headerID}`);
        console.log(response);
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);

    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.activity.toLowerCase().includes(search.toLowerCase()) ||
            row.costcenter.toLowerCase().includes(search.toLowerCase()) ||
            row.gl_code.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'activity', headerName: 'Activity', width: 200,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.activity}
                </Box>
            ),
        },
        { field: 'gl_code', headerName: 'GL Code', width: 200, },
        { field: 'costcenter', headerName: 'Cost Center', width: 200, },
        { field: 'labor_type', headerName: 'Labor Type', width: 200, },
        { field: 'r_st', headerName: 'Regular Day ST', width: 150 },
        { field: 'r_ot', headerName: 'Regular Day OT', width: 150 },
        { field: 'r_nd', headerName: 'Regular Day NP', width: 150 },
        { field: 'r_ndot', headerName: 'Regular Day NPOT', width: 150 },
        { field: 'sh_st', headerName: 'Special Holiday ST', width: 150 },
        { field: 'sh_ot', headerName: 'Special Holiday OT', width: 150 },
        { field: 'sh_nd', headerName: 'Special Holiday NP', width: 150 },
        { field: 'sh_ndot', headerName: 'Special Holiday NPOT', width: 150 },
        { field: 'rh_st', headerName: 'Regular Holiday ST', width: 150 },
        { field: 'rh_ot', headerName: 'Regular Holiday OT', width: 150 },
        { field: 'rh_nd', headerName: 'Regular Holiday NP', width: 150 },
        { field: 'rh_ndot', headerName: 'Regular Holiday NPOT', width: 150 },
        { field: 'rd_st', headerName: 'Regular Day ST', width: 150 },
        { field: 'rd_ot', headerName: 'Regular Day OT', width: 150 },
        { field: 'rd_nd', headerName: 'Regular Day NP', width: 150 },
        { field: 'rd_ndot', headerName: 'Regular Day NPOT', width: 150 },
        { field: 'rdsh_st', headerName: 'Special Holiday ST', width: 150 },
        { field: 'rdsh_ot', headerName: 'Special Holiday OT', width: 150 },
        { field: 'rdsh_nd', headerName: 'Special Holiday NP', width: 150 },
        { field: 'rdsh_ndot', headerName: 'Special Holiday NPOT', width: 150 },
        { field: 'rdrh_st', headerName: 'Regular Holiday ST', width: 150 },
        { field: 'rdrh_ot', headerName: 'Regular Holiday OT', width: 150 },
        { field: 'rdrh_nd', headerName: 'Regular Holiday NP', width: 150 },
        { field: 'rdrh_ndot', headerName: 'Regular Holiday NPOT', width: 150 },

        {
            field: "action", headerAlign: 'right',
            headerName: 'Action',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const SelectData = () => {
                    const obj = params.row;
                    dispatch({ type: FORM_DATA, formData: obj });
                    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
                    dispatch({ type: IS_UPDATE_FORM, isUpdateForm: true });
                };
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button color="warning" size="small" onClick={() => SelectData()}>
                            <EditIcon fontSize="inherit" /> Update
                        </Button>
                        <Button color="error" size="small" onClick={() => selectToDelete('detail', params.row.id)}>
                            <DeleteIcon fontSize="inherit" /> REMOVE
                        </Button>
                    </Box>
                )
            }
        }
    ];

    const openCustomModal = () => {
        if (!headerDataSelected.id) return toast.error('Select header to continue.');
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
    }

    const refreshDataHeader = () => queryClient.invalidateQueries(['/get-accounttochargehdr']);

    const openCustomHeaderModal = () => {
        dispatch({ type: OPEN_CUSTOM_HEADER_MODAL, openCustomHeaderModal: true });
    }

    const refreshData = () => loadEmployeeTemplateDetail(headerData.id);

    const openSearchModal = () => {
        dispatch({ type: OPEN_CUSTOM_SEARCH_MODAL, openCustomSearchModal: true });
    }

    const [deleteType, setDeleteType] = useState('');
    const [deleteID, setDeleteID] = useState('');
    const selectToDelete = (type, id) => {
        setDeleteType(type);
        if (type == "header") {
            if (!headerDataSelected.id) return toast.error('Select header to continue.');
            setDeleteID(headerData.id);
        } else {
            setDeleteID(id);
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }
    const DeleteData = async () => {
        try {
            if (deleteType == 'header') {
                const response = await http.delete(`/remove-accounttochargehdr?id=${deleteID}`);
                if (response.data.success) {
                    toast.success('Data has been deleted successfully.');
                    dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: {} })
                    dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
                    queryClient.invalidateQueries(['/get-accounttochargehdr']);
                    loadEmployeeTemplateDetail(0);
                } else toast.error(response.data.message);
            } else {
                const response = await http.delete(`/remove-accounttocharge?id=${deleteID}`);
                if (response.data.success) {
                    toast.success('Data has been deleted successfully.');
                    dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
                    loadEmployeeTemplateDetail(headerData.id);
                } else toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };

    const updateHeader = () => {
        if (!headerDataSelected.id) return toast.error('Select header to continue.');
        dispatch({ type: FORM_HEADER_DATA, formHeaderData: headerData });
        dispatch({ type: OPEN_CUSTOM_HEADER_MODAL, openCustomHeaderModal: true });
        dispatch({ type: IS_UPDATE_HEADER_FORM, isUpdateHeaderForm: true });
    }

    const clearData = () => {
        dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: {} });
        setHeaderData(defaultHeaderData);
        loadEmployeeTemplateDetail();
    }

    return (
        <Fragment>
            <DeleteSwal maxWidth="xs" onClick={DeleteData} />
            <HeaderModal RefreshData={refreshDataHeader} />
            <DetailModal RefreshData={refreshData} />
            <SearchHeaderModal />
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Button variant="contained" size="medium" onClick={openSearchModal}>Search Header</Button>
                    <Button variant="contained" size="medium" onClick={openCustomHeaderModal}>Create New Account To Charge</Button>
                    {headerData.id ?
                        <>
                            <Button variant="contained" size="medium" color="warning" onClick={updateHeader}>Update Header</Button>
                            <Button variant="contained" size="medium" color="error" onClick={() => { selectToDelete('header') }}>Delete Header</Button>
                            <Button variant="contained" size="medium" color="secondary" onClick={() => { clearData() }}>Clear</Button>
                        </>
                        : ""}
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>Account To Charge Header</Grid>
                            <Grid item xs={12} md={4}><TextField label="Client" value={headerData.client_name} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} /></Grid>
                            <Grid item xs={12} md={4}><TextField label="location" value={headerData.location} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} /></Grid>
                            <Grid item xs={12} md={4}><TextField label="Department" value={headerData.department} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} /></Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Stack sx={{ display: 'flex', paddingTop: '10px', paddingLeft: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                            Account to Charge List
                        </Stack>
                        <Stack sx={{ display: 'flex', padding: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                            <Button variant="contained" size="small" onClick={openCustomModal}>Add Account to Charge</Button>
                        </Stack>
                        <CustomDataGrid
                            columns={ColumnHeader}
                            rows={SearchFilter(constMappedData)}
                            maxHeight={450}
                            height={450}
                            slots={{ noRowsOverlay: NoData }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default AccountMasterData