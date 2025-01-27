import { Box, Button, Grid, Paper, Stack, TextField, IconButton } from "@mui/material"
import { Fragment, useState, useCallback } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../../../api/http";
import { toast } from "sonner";
import { OPEN_DELETESWAL, OPEN_SWALCONFIRMATION } from "../../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../../components/Swal/DeleteSwal";
import CloseCancelSubmitSwal from "../../../../components/Swal/CloseCancelSubmitSwal";
import NewDarHeader from "../components/NewDARHeader";
import SearchDARHeaderModal from "../components/SearchDARHeader";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import AddDARDetail from "../components/AddDARDetail.jsx";
import TransferEmployeeModal from "../components/TransferEmployee.jsx";

const DARdata = () => {
    const [loadSaving, setLoadSaving] = useState(false);
    const dispatch = useDispatch();

    // header
    const initialDataVariableHeader = {
        id: "",
        soa_no_link: "",
        day_type_idlink: "",
        locationlink_id: "",
        xDate: "",
        shift: "",
        dar_status: "",
        prepared_by: "",
        prepared_by_pos: "",
        approved_by: "",
        approved_by_pos: "",
        checked_by: "",
        checked_by_pos: "",
        confirmed_by: "",
        confirmed_by_pos: "",
        templatelink_id: "",
        template_name: "",
        activity: "",
        department: "",
        group_name: "",
    };
    const [dataVariableHeader, setDataVariableHeader] = useState(initialDataVariableHeader);

    const updateDARHeader = () => {
        setPassDataHeader(dataVariableHeader);
        setOpenModal(true);
    }

    const [deleteID, setDeleteID] = useState('');
    const [deleteType, setDeleteType] = useState('');
    const deleteData = async (id = 0) => {
        if (id == 0) {
            // header
            if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
            setDeleteID(dataVariableHeader.id);
            setDeleteType('header');
        } else {
            setDeleteID(id);
            setDeleteType('detail');
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }
    const confirmDelete = async () => {
        setLoadSaving("Deleting...");
        if (deleteType == 'header') {
            const response = await http.delete(`/remove-darheader?id=${deleteID}`);
            if (response.data.success) {
                toast.success(response.data.message);
                clearData();
            } else toast.error(response.data.message);
        } else {
            const response = await http.delete(`/remove-dardetail?id=${deleteID}`);
            if (response.data.success) {
                toast.success(response.data.message);
                loadDARDetail(dataVariableHeader.id);
            } else toast.error(response.data.message);
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: false });
        setLoadSaving(false);
    }

    const postDarHeader = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: true });
    }
    const confirmPostDarHeader = async () => {
        setLoadSaving("Posting...");
        const response = await http.post('/post-postdarheader', { id: dataVariableHeader.id });
        if (response.data.success) {
            toast.success(response.data.message);
            setDataVariableHeader(prevState => ({
                ...prevState,
                dar_status: "POSTED",
            }));
        } else toast.error(response.data.message);
        setLoadSaving(false);
        dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: false });
    }

    // detail
    const [constMappedData, setConstMappedData] = useState([]);
    const loadDARDetail = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-dardetail?header_id=${headerID}`);
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(search.toLowerCase()) ||
            row.emp_lname.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 150,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'fullname', headerName: 'Name', width: 250,
            renderCell: (params) => (
                <Box>
                    {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
                </Box>
            ),
        },
        { field: 'activity', headerName: 'Activity', flex: 1, },
        { field: 'time_in', headerName: 'Time In', flex: 1, },
        { field: 'time_out', headerName: 'Time Out', flex: 1, },
        { field: 'st', headerName: 'ST', flex: 1, },
        { field: 'ot', headerName: 'OT', flex: 1, },
        { field: 'nd', headerName: 'ND', flex: 1, },
        { field: 'ndot', headerName: 'NDOT', flex: 1, },
        { field: 'gl', headerName: 'GL Code', flex: 1, },
        { field: 'cost_center', headerName: 'Cost Center', flex: 1, },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const SelectedRow = () => {
                    setPassDataDetail(params.row);
                    setOpenModalDARDetail(true);
                }
                const selectToDelete = () => {
                    deleteData(params.row.id);
                    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <IconButton color="primary" size="small" onClick={SelectedRow}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => selectToDelete()}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                )
            }
        }
    ];

    const addDARDetail = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setOpenModalDARDetail(true);
        setPassDataDetail(prevState => ({
            ...prevState,
            dar_idlink: dataVariableHeader.id,
        }));
    }

    const transferEmployee = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setOpenModalTransferEmployee(true);
        setPassDataTransferEmployee({id: dataVariableHeader.id, date: dataVariableHeader.xDate}); // pass header id to get detail inside modal
    }

    // modal
    const [openModal, setOpenModal] = useState(false);
    const [passDataHeader, setPassDataHeader] = useState({});
    async function modalClose(params) {
        setOpenModal(false);
        setPassDataHeader({});
        if (params) {
            setDataVariableHeader(params);
            loadDARDetail(params.id);
        }
    }

    const [openModalSearchDARHeader, setOpenModalSearchDARHeader] = useState(false);
    async function modalCloseSearchDARHeader(params) {
        setOpenModalSearchDARHeader(false);
        if (params) {
            setDataVariableHeader(params);
            loadDARDetail(params.id);
        }
    }

    const [openModalDARDetail, setOpenModalDARDetail] = useState(false);
    const [passDataDetail, setPassDataDetail] = useState({});
    async function modalCloseDARDetail(params) {
        setOpenModalDARDetail(false);
        setPassDataDetail({});
        if (params) {
            loadDARDetail(dataVariableHeader.id);
        }
    }

    const [openModalTransferEmployee, setOpenModalTransferEmployee] = useState(false);
    const [passDataTransferEmployee, setPassDataTransferEmployee] = useState({});
    async function modalCloseDARTransferEmployee(params) {
        setOpenModalTransferEmployee(false);
        setPassDataTransferEmployee({});
        if (params) {
            loadDARDetail(dataVariableHeader.id);
        }
    }

    const clearData = async (type = 'all') => {
        setConstMappedData([]);
        setDataVariableHeader(initialDataVariableHeader);
    }

    return (
        <Fragment>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <DeleteSwal maxWidth="xs" onClick={confirmDelete} />
            <CloseCancelSubmitSwal maxWidth="xs" onClick={confirmPostDarHeader} confirmTitle="Are you sure that the entered data is correct and you want to execute post?" />
            <NewDarHeader
                openModal={openModal}
                onCloseModal={modalClose}
                passedData={passDataHeader}
            />
            <SearchDARHeaderModal
                openModal={openModalSearchDARHeader}
                onCloseModal={modalCloseSearchDARHeader}
            />
            <AddDARDetail
                openModal={openModalDARDetail}
                onCloseModal={modalCloseDARDetail}
                passedData={passDataDetail}
            />
            <TransferEmployeeModal
                openModal={openModalTransferEmployee}
                onCloseModal={modalCloseDARTransferEmployee}
                passedData={passDataTransferEmployee}
            />
            <Grid container spacing={0.5}>
                <Grid item xs={12} md={12}>
                    <Paper sx={{ padding: 2 }}>
                        {/* <form noValidate onSubmit={handleSubmit}> */}
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Employee Template" value={dataVariableHeader.activity} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Location" value={dataVariableHeader.locationlink_id} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Department" value={dataVariableHeader.department} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" value={dataVariableHeader.xDate} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Shifting" value={dataVariableHeader.shift} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Day Type" value={dataVariableHeader.day_type_idlink} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Group Name" value={dataVariableHeader.group_name} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Prepared By" value={dataVariableHeader.prepared_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Checked By" value={dataVariableHeader.checked_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Confirmed By" value={dataVariableHeader.confirmed_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Aprroved By" value={dataVariableHeader.approved_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="STATUS" value={dataVariableHeader.dar_status} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>

                            <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                                <Button variant="contained" size="small" onClick={() => { setOpenModalSearchDARHeader(true) }}>SEARCH DAR HEADER</Button>
                                <Button variant="contained" size="small" onClick={() => { setOpenModal(true); }} >CREATE NEW DAR</Button>
                                {dataVariableHeader.id && dataVariableHeader.dar_status == "ACTIVE" ?
                                    <>
                                        <Button variant="contained" size="small" color="warning" onClick={() => { updateDARHeader() }}>UPDATE DAR</Button>
                                        <Button variant="contained" size="small" color="error" onClick={() => { deleteData() }}>DELETE DAR</Button>
                                        <Button variant="contained" size="small" color="warning" onClick={() => { postDarHeader() }}>POST DAR</Button>
                                    </>
                                    : ""}
                                <Button variant="contained" size="small" color="secondary" onClick={() => { setOpenModal(true) }}>PRINT DAR</Button>
                                <Button variant="contained" size="small" color="info" onClick={clearData}>New/Clear</Button>
                            </Grid>
                        </Grid>
                        {/* </form> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Stack sx={{ display: 'flex', padding: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                            {dataVariableHeader.dar_status == "ACTIVE" ?
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Button variant="contained" size="small" onClick={() => { addDARDetail() }}>Add DAR Details</Button>
                                    <Button variant="contained" size="small" color="warning" onClick={() => { transferEmployee() }}>Transfer Employee</Button>
                                </Box>
                                : ""}
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

export default DARdata