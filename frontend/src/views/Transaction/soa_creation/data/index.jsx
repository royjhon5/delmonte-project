import { Button, Grid, Paper, Stack, TextField, Box } from "@mui/material"
import { Fragment, useState, useCallback } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import http from "../../../../api/http";
import { toast } from "sonner";
import { OPEN_DELETESWAL } from "../../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../../components/Swal/DeleteSwal";
import NewSOAHeaderModal from "../components/NewSOAHeader";
import SearchSOAHeaderModal from "../components/SearchSOAHeader";
import AddSOADetailModal from "../components/AddSOADetail";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import ConfirmationSwal from "../../../../components/Swal/CloseCancelSubmitSwal2";

const SOAdata = () => {
    const [loadSaving, setLoadSaving] = useState(false);
    const dispatch = useDispatch();

    // header
    const initialDataVariableHeader = {
        id: "",
        dept_idlink: "",
        location_idlink: "",
        daytype_idlink: "",
        soa_no: "",
        xDate: "",
        soa_status: "",
        prepared_by: "",
        preparedby_position: "",
        checked_by: "",
        checkedby_position: "",
        confirmed_by: "",
        confirmedby_position: "",
        approved_by: "",
        approvedby_position: "",
        period_coverage: "",
        department: "",
        location: "",
        daytype: "",
    };
    const [dataVariableHeader, setDataVariableHeader] = useState(initialDataVariableHeader);

    const updateSOAHeader = () => {
        setPassDataHeader(dataVariableHeader);
        setOpenModal(true);
    }

    const [deleteID, setDeleteID] = useState('');
    const [deleteType, setDeleteType] = useState('');
    const deleteData = async (id = 0) => {
        if (id == 0) {
            // header
            if (!dataVariableHeader.id) return toast.error("Please select SOA Header to continue.");
            setDeleteID(dataVariableHeader.id);
            setDeleteType('header');
        } else {
            // detail
            setDeleteID(id);
            setDeleteType('detail');
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
    }
    const confirmDelete = async () => {
        setLoadSaving("Deleting...");
        if (deleteType == 'header') {
            const response = await http.delete(`/remove-soaheader?id=${deleteID}`);
            if (response.data.success) {
                toast.success(response.data.message);
                clearData();
            } else toast.error(response.data.message);
        } else {
            const response = await http.delete(`/remove-soadetail?id=${deleteID}`);
            if (response.data.success) {
                toast.success(response.data.message);
                loadSOADetail(dataVariableHeader.id);
            } else toast.error(response.data.message);
        }
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: false });
        setLoadSaving(false);
    }

    const [openConfirmationPost, setOpenConfirmationPost] = useState(false);
    async function confirmationPostClose() {
        setOpenConfirmationPost(false);
    }
    const postSOAHeader = () => {
        if (!dataVariableHeader.id) return toast.error("Please select SOA Header to continue.");
        setOpenConfirmationPost(true);
    }
    const confirmPostSOAHeader = async () => {
        setLoadSaving("Posting...");
        const response = await http.post('/post-postsoaheader', { id: dataVariableHeader.id });
        if (response.data.success) {
            toast.success(response.data.message);
            setDataVariableHeader(prevState => ({
                ...prevState,
                soa_status: "POSTED",
            }));
        } else toast.error(response.data.message);
        setLoadSaving(false);
        setOpenConfirmationPost(false);
    }

    const printDar = async () => {
        // window.open(linkToBackend + "/print-summary-by-date-range?dataVariable[DocTypeLinkID]=" + dataVariable.DocTypeLinkID +
        //     "&dataVariable[byCat]=" + dataVariable.byCat +
        //     "&dataVariable[DateFrom]=" + dataVariable.DateFrom +
        //     "&dataVariable[DateTo]=" + dataVariable.DateTo +
        //     "&dataVariable[GeneratedBy]=" + accessToken.Fname +
        //     "&dataVariable[userID]=" + accessToken.userID +
        //     "&dataVariable[checkReport]=0"
        //     , "_blank");
    }

    // details
    const [constMappedData, setConstMappedData] = useState([]);
    const loadSOADetail = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-soadetail?header_id=${headerID}`);
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.activity.toLowerCase().includes(search.toLowerCase()) ||
            row.gl_account.toLowerCase().includes(search.toLowerCase()) ||
            row.cost_center.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'activity', headerName: 'Activity', width: 120,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.activity}
                </Box>
            ),
        },
        { field: 'gl_account', headerName: 'GL', width: 120, },
        { field: 'cost_center', headerName: 'Cost Center', width: 120, },
        { field: 'thst', headerName: 'ST HRS', type: 'number', width: 100, },
        { field: 'thot', headerName: 'OT HRS', type: 'number', width: 100, },
        { field: 'thnd', headerName: 'ND HRS', type: 'number', width: 100, },
        { field: 'thndot', headerName: 'ND-OT HRS', type: 'number', width: 100, },
        { field: 'c_rates_st', headerName: 'ST RATE', type: 'number', width: 100, },
        { field: 'c_rates_ot', headerName: 'OT RATE', type: 'number', width: 100, },
        { field: 'c_rates_nd', headerName: 'ND RATE', type: 'number', width: 100, },
        { field: 'c_rates_ndot', headerName: 'ND-OT RATE', type: 'number', width: 100, },
        { field: 'tast', headerName: 'ST AMNT', type: 'number', width: 100, },
        { field: 'taot', headerName: 'OT AMNT', type: 'number', width: 100, },
        { field: 'tand', headerName: 'ND AMNT', type: 'number', width: 100, },
        { field: 'tandot', headerName: 'ND-OT AMNT', type: 'number', width: 100, },
        { field: 'tta', headerName: 'TOTAL AMOUNT', type: 'number', width: 130, },
        {
            field: 'thc', headerName: 'HC', width: 100, type: 'number',
            renderCell: (params) => (
                <Box sx={{ paddingRight: 1 }}>
                    {params.row.thc}
                </Box>
            ),
        },
    ];

    const addSOADetail = () => {
        if (!dataVariableHeader.id) return toast.error("Please select SOA Header to continue.");
        setOpenModalSOADetail(true);
        setPassDataDetail(prevState => ({
            ...prevState,
            id: dataVariableHeader.id,
            date: dataVariableHeader.xDate
        }));
    }

    // modals
    const [openModal, setOpenModal] = useState(false);
    const [passDataHeader, setPassDataHeader] = useState({});
    async function modalClose(params) {
        setOpenModal(false);
        setPassDataHeader({});
        if (params) {
            setDataVariableHeader(params);
        }
    }

    const [openModalSearchSOAHeader, setOpenModalSearchSOAHeader] = useState(false);
    async function modalCloseSearchSOAHeader(params) {
        setOpenModalSearchSOAHeader(false);
        if (params) {
            setDataVariableHeader(params);
            loadSOADetail(params.id);
        }
    }

    const [openModalSOADetail, setOpenModalSOADetail] = useState(false);
    const [passDataDetail, setPassDataDetail] = useState({});
    async function modalCloseSOADetail(params) {
        setOpenModalSOADetail(false);
        setPassDataDetail({});
        if (params) {
            loadSOADetail(dataVariableHeader.id);
        }
    }

    const clearData = async (type = 'all') => {
        setConstMappedData([]);
        setDataVariableHeader(initialDataVariableHeader);
    }

    return (
        <Fragment>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <ConfirmationSwal openConfirmation={openConfirmationPost} maxWidth="xs" onClose={confirmationPostClose} onConfirm={confirmPostSOAHeader} confirmTitle="Are you sure that the entered data is correct and you want to execute post?" />
            <DeleteSwal maxWidth="xs" onClick={confirmDelete} />
            <NewSOAHeaderModal
                openModal={openModal}
                onCloseModal={modalClose}
                passedData={passDataHeader}
            />
            <SearchSOAHeaderModal
                openModal={openModalSearchSOAHeader}
                onCloseModal={modalCloseSearchSOAHeader}
            />
            <AddSOADetailModal
                openModal={openModalSOADetail}
                onCloseModal={modalCloseSOADetail}
                passedData={passDataDetail}
            />
            <Grid container spacing={0.5}>
                <Grid item xs={12} md={12}>
                    <Paper sx={{ padding: 2 }}>
                        {/* <form noValidate onSubmit={handleSubmit}> */}
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="SOA Number" value={dataVariableHeader.soa_no} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Department" value={dataVariableHeader.department} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Location" value={dataVariableHeader.location} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Day Type" value={dataVariableHeader.daytype} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" value={dataVariableHeader.xDate} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Period Coverage" value={dataVariableHeader.period_coverage} variant="outlined" size="small" inputProps={{ readOnly: true }} />
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
                                <TextField fullWidth label="Approved By" value={dataVariableHeader.approved_by} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="STATUS" value={dataVariableHeader.soa_status} variant="outlined" size="small" inputProps={{ readOnly: true }} />
                            </Grid>

                            <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                                <Button variant="contained" size="small" onClick={() => { setOpenModalSearchSOAHeader(true) }}>SEARCH SOA HEADER</Button>
                                <Button variant="contained" size="small" onClick={() => { setOpenModal(true) }} >CREATE NEW SOA</Button>
                                {dataVariableHeader.id && dataVariableHeader.soa_status == "ACTIVE" ?
                                    <>
                                        <Button variant="contained" size="small" color="warning" onClick={() => { updateSOAHeader() }}>UPDATE SOA</Button>
                                        <Button variant="contained" size="small" color="error" onClick={() => { deleteData() }}>DELETE SOA</Button>
                                        <Button variant="contained" size="small" color="warning" onClick={() => { postSOAHeader() }}>POST SOA</Button>
                                    </>
                                    : ""}
                                <Button variant="contained" size="small" color="secondary" onClick={() => { printDar() }}>PRINT SOA</Button>
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
                            {dataVariableHeader.soa_status == "ACTIVE" ?
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Button variant="contained" size="small" color="error" onClick={() => { addSOADetail() }}>REMOVE DAR FROM SOA</Button>
                                    <Button variant="contained" size="small" onClick={() => { addSOADetail() }}>ADD SOA DETAILS</Button>
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

export default SOAdata