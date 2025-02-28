import { Box, Button, Grid, Paper, Stack, TextField, IconButton, Checkbox, Chip } from "@mui/material"
import { Fragment, useState, useCallback } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../../../api/http";
import { toast } from "sonner";
import { OPEN_DELETESWAL } from "../../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../../components/Swal/DeleteSwal";
import ConfirmationSwal from "../../../../components/Swal/CloseCancelSubmitSwal2";
import NewDarHeader from "../components/NewDARHeader";
import SearchDARHeaderModal from "../components/SearchDARHeader";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import AddDARDetail from "../components/AddDARDetail.jsx";
import ActivityBreakdown from "../components/ActivityBreakdown.jsx";
import TransferEmployeeModal from "../components/TransferEmployee.jsx";
import DARBreakdownModal from "../components/DARBreakdown.jsx";
import { linkToBackend } from '../../../../store/constant';

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
        checked_by: "",
        checked_by_pos: "",
        templatelink_id: "",
        activity: "",
        department: "",
        group_name: "",
        location: "",
        daytype: "",
        dar_no: "",
        departmend_id: "",
        client_id: "",
        client_name: "",
        shift_time_in_hour: "",
        shift_time_in_min: "",
        shift_time_out_hour: "",
        shift_time_out_min: "",
        totalHours: 0
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

    const [confirmationType, setConfirmationType] = useState('');
    const [confirmationTitle, setConfirmationTitle] = useState('');
    const [openConfirmation, setOpenConfirmation] = useState(false);
    async function confirmationClose() {
        setOpenConfirmation(false);
    }
    const confirmConfirmation = async () => {
        if (confirmationType == 'post') {
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
        } else if (confirmationType == 'compute') {
            setLoadSaving("Computing...");
            const response = await http.post('/post-autocomputedar', { id: dataVariableHeader.id });
            if (response.data.success) {
                toast.success(response.data.message);
                loadDARDetail(dataVariableHeader.id);
            } else toast.error(response.data.message);
            setLoadSaving(false);
        } else if (confirmationType == 'bulk delete') {
            setLoadSaving("Deleting...");
            let idList = chapaChecked;
            const response = await http.post('/post-bulkdardtldelete', { ids: idList });
            if (response.data.success) {
                toast.success(response.data.message);
                loadDARDetail(dataVariableHeader.id);
            } else toast.error(response.data.message);
            setLoadSaving(false);
        }
        setOpenConfirmation(false);
    }

    const postDarHeader = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setConfirmationType('post');
        setConfirmationTitle('Are you sure that the entered data is correct and you want to execute post?');
        setOpenConfirmation(true);
    }

    const autoComputeTime = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setConfirmationType('compute');
        setConfirmationTitle('Are you sure you want to execute auto computation?');
        setOpenConfirmation(true);
    }

    const bulkDelete = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        if (chapaChecked.length == 0) return toast.error("Please select row using the provided checkbox.");
        setConfirmationType('bulk delete');
        setConfirmationTitle('Are you sure you want to execute bulk delete?');
        setOpenConfirmation(true);
    }

    // detail
    const [constMappedData, setConstMappedData] = useState([]);
    const loadDARDetail = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-dardetail?header_id=${headerID}`);
        if (response.data.length > 0) {
            console.log(response);
            let lastChapa = response.data[0].ChapaID;
            let dataArr = [];
            await response.data.map((row, index) => {
                if (lastChapa != row.ChapaID) {
                    lastChapa = row.ChapaID;
                    dataArr.push({ id: index + "index", ChapaID: "", emp_lname: "", emp_fname: "", is_blank: 1 });
                }
                row.is_blank = 0;
                dataArr.push(row);
            })
            setConstMappedData(dataArr);
        } else setConstMappedData([]);

        // setConstMappedData(Array.isArray(response.data) ?  : []);
    }, []);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(search.toLowerCase()) ||
            row.emp_lname.toLowerCase().includes(search.toLowerCase()) ||
            row.emp_fname.toLowerCase().includes(search.toLowerCase())
        );
    };

    const [chapaChecked, setChapaChecked] = useState([]);
    const checkCkbx = (checked, chapa = '') => {
        if (!chapa) {
            if (checked) {
                setChapaChecked(constMappedData.map(row => row.id));
            } else {
                setChapaChecked([]);
            }
        } else {
            if (checked) {
                setChapaChecked(prevState => [...prevState, chapa]);
            } else {
                setChapaChecked((prevState) => prevState.filter((item) => item !== chapa));
            }
        }
    }

    const ColumnHeader = [
        {
            field: 'id', headerName: '', width: 200, align: 'left',
            renderCell: (params) => (
                <>
                    {params.row.is_blank == 0 ?
                        <>
                            <Checkbox
                                checked={chapaChecked.includes(params.row.id)}
                                sx={{ paddingLeft: 2 }}
                                onChange={(event) => { checkCkbx(event.target.checked, params.row.id) }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            {params.row.is_main == 1 ? <Chip size="small" label="FROM BIO" color="warning" variant="outlined" /> : <Chip size="small" label="BREAKDOWN" color="success" variant="outlined" />}
                        </>
                        : ""
                    }
                </>
            ),
        },
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 150,
            renderCell: (params) => (
                <>
                    {params.row.is_blank == 0 ?
                        <Box sx={{ paddingLeft: 1 }}>
                            {params.row.ChapaID}
                        </Box>
                        : ""
                    }
                </>
            ),
        },
        {
            field: 'fullname', headerName: 'Name', width: 250,
            renderCell: (params) => (
                <>
                    {params.row.is_blank == 0 ?
                        <Box>
                            {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
                        </Box>
                        : ""
                    }
                </>
            ),
        },
        { field: 'activity', headerName: 'Activity', flex: 1, },
        {
            field: 'time_in', headerName: 'Time In', flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.time_in == "" ?
                        <Box sx={{ backgroundColor: "#f44336" }}>
                            N/A
                        </Box>
                        :
                        <Box>
                            {params.row.time_in}
                        </Box>
                    }
                </>
            ),
        },
        {
            field: 'time_out', headerName: 'Time Out', flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.time_out == "" ?
                        <Box sx={{ backgroundColor: "#f44336" }}>
                            N/A
                        </Box>
                        :
                        <Box>
                            {params.row.time_out}
                        </Box>
                    }
                </>
            ),
        },
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
                    if (dataVariableHeader.dar_status == "POSTED") return toast.error("Cannot edit. DAR is already Posted.");
                    setPassDataDetail(params.row);
                    setOpenModalDARDetail(true);
                }
                const selectToDelete = () => {
                    if (dataVariableHeader.dar_status == "POSTED") return toast.error("Cannot delete. DAR is already Posted.");
                    deleteData(params.row.id);
                    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
                    console.log(chapaChecked);
                }
                const selectDARBreakdown = () => {
                    if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
                    const personName = params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name;
                    setOpenDARBreakdown(true);
                    setPassDataDARBreakDown({
                        id: dataVariableHeader.id,
                        date: dataVariableHeader.xDate,
                        ChapaID: params.row.ChapaID,
                        personName: personName,
                        emp_fname: params.row.emp_fname,
                        emp_mname: params.row.emp_mname,
                        emp_lname: params.row.emp_lname,
                        emp_ext_name: params.row.emp_ext_name,
                    });
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        {params.row.is_blank == 0 ?
                            <>
                                {
                                    params.row.is_main == 0 ?
                                        <IconButton color="primary" size="small" onClick={selectDARBreakdown}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        : ""
                                }
                                <IconButton color="error" size="small" onClick={() => selectToDelete()}>
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </>

                            : ""
                        }
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
            is_main: 1
        }));
    }

    const activityBreakdown = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setOpenModalActivityBreakdown(true);
        setPassDataActivityBreakdown(prevState => ({
            ...prevState,
            dar_idlink: dataVariableHeader.id,
        }));
    }

    const transferEmployee = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        setOpenModalTransferEmployee(true);
        setPassDataTransferEmployee({ id: dataVariableHeader.id, date: dataVariableHeader.xDate }); // pass header id to get detail inside modal
    }

    const printDAR = () => {
        if (!dataVariableHeader.id) return toast.error("Please select DAR Header to continue.");
        window.open(linkToBackend + `/get-printdardetails?id=${dataVariableHeader.id}`, "_blank");
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
        loadDARDetail(dataVariableHeader.id);
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

    const [openModalDARBreakdown, setOpenDARBreakdown] = useState(false);
    const [passDataDARBreakdown, setPassDataDARBreakDown] = useState({});
    async function modalCloseDARBreakdown(params) {
        setOpenDARBreakdown(false);
        setPassDataDARBreakDown({});
        loadDARDetail(dataVariableHeader.id);
    }

    const [openModalActivityBreakdown, setOpenModalActivityBreakdown] = useState(false);
    const [passDataActivityBreakdown, setPassDataActivityBreakdown] = useState({});
    async function modalCloseActivityBreakdown(params) {
        console.log('here');
        setOpenModalActivityBreakdown(false);
        setPassDataActivityBreakdown({});
        loadDARDetail(dataVariableHeader.id);
    }

    const clearData = async (type = 'all') => {
        setConstMappedData([]);
        setDataVariableHeader(initialDataVariableHeader);
        setChapaChecked([]);
    }

    return (
        <Fragment>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <DeleteSwal maxWidth="xs" onClick={confirmDelete} />
            <ConfirmationSwal
                openConfirmation={openConfirmation}
                maxWidth="xs"
                onClose={confirmationClose}
                onConfirm={confirmConfirmation}
                confirmTitle={confirmationTitle} />
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
            <ActivityBreakdown
                openModal={openModalActivityBreakdown}
                onCloseModal={modalCloseActivityBreakdown}
                passedData={passDataActivityBreakdown}
            />
            <TransferEmployeeModal
                openModal={openModalTransferEmployee}
                onCloseModal={modalCloseDARTransferEmployee}
                passedData={passDataTransferEmployee}
            />
            <DARBreakdownModal
                openModal={openModalDARBreakdown}
                onCloseModal={modalCloseDARBreakdown}
                passedData={passDataDARBreakdown}
            />
            <Grid container spacing={0.5}>
                <Grid item xs={12} md={12}>
                    <Paper sx={{ padding: 2 }}>
                        {/* <form noValidate onSubmit={handleSubmit}> */}
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="DAR No." value={dataVariableHeader.dar_no} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Group Name" value={dataVariableHeader.group_name} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Client" value={dataVariableHeader.client_name} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Location" value={dataVariableHeader.location} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Department" value={dataVariableHeader.department} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" value={dataVariableHeader.xDate} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Day Type" value={dataVariableHeader.daytype} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Shifting" value={dataVariableHeader.shift} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Work Schedule" value={dataVariableHeader.shift_time_in_hour + dataVariableHeader.shift_time_in_min + " - " + dataVariableHeader.shift_time_out_hour + dataVariableHeader.shift_time_out_min} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Prepared By" value={dataVariableHeader.prepared_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Reviewed By" value={dataVariableHeader.checked_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
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
                                <Button variant="contained" size="small" color="secondary" onClick={() => { printDAR() }}>PRINT DAR</Button>
                                <Button variant="contained" size="small" color="info" onClick={clearData}>New/Clear</Button>
                            </Grid>
                        </Grid>
                        {/* </form> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Stack sx={{ display: 'flex', padding: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                <Checkbox
                                    // checked={checked}
                                    onChange={(event) => { checkCkbx(event.target.checked) }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '500px', lg: '500px' } }} />
                            </Box>
                            {dataVariableHeader.dar_status == "ACTIVE" ?
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Button variant="contained" size="small" color="error" onClick={() => { bulkDelete() }}>Bulk Delete</Button>
                                    <Button variant="contained" size="small" color="info" onClick={() => { activityBreakdown() }}>Add Activity Breakdown</Button>
                                    <Button variant="contained" size="small" color="secondary" onClick={() => { autoComputeTime() }}>Auto Compute Time</Button>
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