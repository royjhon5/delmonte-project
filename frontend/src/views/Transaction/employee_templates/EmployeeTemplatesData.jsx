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
import { OPEN_CUSTOM_MODAL, OPEN_DELETESWAL, OPEN_CUSTOM_HEADER_MODAL, OPEN_CUSTOM_SEARCH_MODAL, SEARCH_SELECTED_DATA, FORM_HEADER_DATA, IS_UPDATE_HEADER_FORM } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import HeaderModal from "./components/HeaderModal";
import DetailModal from "./components/DetailModal";
import SearchHeaderModal from "./components/SearchHeaderModal";

const EmployeeTemplatesData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: {} });
    }, []);
    const defaultHeaderData = {
        id: '',
        TName: '',
        activityname: '',
        department: '',
        emp_group: '',
        shifting: '',
    }
    const [headerData, setHeaderData] = useState(defaultHeaderData);
    const headerDataSelected = useSelector((state) => state.customization.searchSelectedData);
    useEffect(() => {
        if (headerDataSelected.id) {
            setHeaderData(headerDataSelected);
        } else {
            setHeaderData(defaultHeaderData);
        }
        loadEmployeeTemplateDetail(headerData.id);
    }, [headerDataSelected, headerData, defaultHeaderData])

    const [constMappedData, setConstMappedData] = useState([]);
    const loadEmployeeTemplateDetail = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-employeetemplatedetail?header_id=${headerID}`);
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);

    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(search.toLowerCase()) ||
            row.last_name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'chapaID', headerName: 'Chapa ID', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'name', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.first_name + " " + params.row.middle_name + " " + params.row.last_name + " " + params.row.ext_name}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button color="error" size="small" onClick={() => selectToDelete('detail', params.row.id)}>
                            <DeleteIcon fontSize="inherit" /> REMOVE EMPLOYEE
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

    const refreshDataHeader = () => queryClient.invalidateQueries(['/get-employeetemplateheader']);

    const openCustomHeaderModal = () => {
        dispatch({ type: OPEN_CUSTOM_HEADER_MODAL, openCustomHeaderModal: true });
    }

    const refreshData = () => queryClient.invalidateQueries(['/get-location']);

    const openSearchModal = () => {
        dispatch({ type: OPEN_CUSTOM_SEARCH_MODAL, openCustomSearchModal: true });
    }

    const [deleteType, setDeleteType] = useState('');
    const [deleteID, setDeleteID] = useState('');
    const selectToDelete = (type, id) => {
        setDeleteType(type);
        if(type == "header"){
            if (!headerDataSelected.id) return toast.error('Select header to continue.');
            setDeleteID(headerData.id);
        }else{
            setDeleteID(id);
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }
    const DeleteData = async () => {
        try {
            if (deleteType == 'header') {
                const response = await http.delete(`/remove-employeetemplateheader?id=${deleteID}`);
                if(response.data.success){
                    toast.success('Data has been deleted successfully.');
                    dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: {} })
                    dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
                    queryClient.invalidateQueries(['/get-employeetemplateheader']);
                } else toast.error(response.data.message);
            } else {
                const response = await http.delete(`/remove-employeetemplatedetail?id=${deleteID}`);
                if(response.data.success){
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
                <Grid item xs={12} md={3}>
                    <Button sx={{ marginBottom: "1%", marginRight: "1%" }} variant="contained" size="medium" onClick={openSearchModal}>Search Header</Button>
                    <Button sx={{ marginBottom: "1%" }} variant="contained" size="medium" onClick={openCustomHeaderModal}>Add Employee Template Header</Button>
                    <Paper sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <TextField label="Template Name" value={headerData.TName} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                <TextField label="Activity" value={headerData.activityname} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                <TextField label="Department" value={headerData.department} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                <TextField label="Group" value={headerData.emp_group} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                <TextField label="Shifting" value={headerData.shifting} fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={updateHeader} sx={{ marginTop: "2%", marginRight: "1%" }}>Update Header</Button>
                        <Button variant="contained" color="error" onClick={() => { selectToDelete('header') }} sx={{ marginTop: "2%", marginRight: "1%" }}>Delete Header</Button>
                        <Button variant="contained" color="secondary" onClick={() => { clearData() }} sx={{ marginTop: "2%" }}>Clear</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper>
                        <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                            <Button variant="contained" size="small" onClick={openCustomModal}>Add Employee Template</Button>
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

export default EmployeeTemplatesData