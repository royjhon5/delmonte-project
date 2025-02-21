import { Box, Button, Grid, TextField, Paper, Stack, Typography, IconButton } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";
import AddDARDetail from "../components/AddDARDetail.jsx";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { OPEN_DELETESWAL2 } from "../../../../store/actions";
import DeleteSwal2 from "../../../../components/Swal/DeleteSwal2";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

const DARBreakdownModal = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const [loadSaving, setLoadSaving] = useState(false);
    const dispatch = useDispatch();
    const closeCurrentModal = () => {
        onCloseModal({ success: true });
    }

    const [constMappedData, setConstMappedData] = useState([]);
    const [headerID, setHeaderID] = useState("");
    const [chapaID, setChapaID] = useState("");
    const [date, setDate] = useState("");
    const [personName, setPersonName] = useState("");
    const [emp_fname, setFName] = useState("");
    const [emp_mname, setMName] = useState("");
    const [emp_lname, setLName] = useState("");
    const [emp_ext_name, setExtName] = useState("");
    const [timeIn, setTimeIn] = useState("");
    const [timeOut, setTimeOut] = useState("");
    const loadDARDetailTime = useCallback(async (chapaID, date) => {
        const response = await http.get(`/get-daremployeetime?chapa_id=${chapaID}&date=${date}`); // get time in and time out of employee selected
        console.log(response);
        if (response.data.length > 0) {
            setTimeIn(response.data[0].time_in);
            setTimeOut(response.data[0].time_out);
        }
    }, []);
    const loadDARDetail = useCallback(async (headerID, chapaID) => {
        const response = await http.get(`/get-dardetailbychapa?header_id=${headerID}&chapa_id=${chapaID}`);
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);

    const ColumnHeader = [
        {
            field: 'activity', headerName: 'Activity', flex: 1,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.activity}
                </Box>
            ),
        },
        { field: 'time_in', headerName: 'Time In', flex: 1, },
        { field: 'time_out', headerName: 'Time Out', flex: 1, },
        { field: 'st', headerName: 'ST', flex: 1, },
        { field: 'ot', headerName: 'OT', flex: 1, },
        { field: 'nd', headerName: 'ND', flex: 1, },
        { field: 'ndot', headerName: 'NDOT', flex: 1, },
        { field: 'gl', headerName: 'GL Code', flex: 1, },
        { field: 'cost_center	', headerName: 'Cost Center', flex: 1, },
        {
            field: "action", headerAlign: 'center',
            headerName: 'Action',
            width: 150,
            align: 'center',
            renderCell: (params) => {
                const SelectedRow = () => {
                    setPassDataDetail(params.row);
                    setOpenModalDARDetail(true);
                }
                const selectToDelete = () => {
                    deleteData(params.row.id);
                    dispatch({ type: OPEN_DELETESWAL2, confirmDelete2: true });
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        {params.row.is_main == 0 ?
                            <Box sx={{ paddingRight: 1 }}>
                                <IconButton color="primary" size="small" onClick={SelectedRow}>
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton color="error" size="small" onClick={() => selectToDelete()}>
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </Box>
                            : "BIO RECORD"}
                    </Box>
                )
            }
        }
    ];

    const addDARDetail = () => {
        setOpenModalDARDetail(true);
        setPassDataDetail({
            dar_idlink: headerID,
            ChapaID: chapaID,
            emp_lname: emp_lname,
            emp_fname: emp_fname,
            emp_mname: emp_mname,
            emp_ext_name: emp_ext_name,
            is_main: 0
        });
    }

    const [deleteID, setDeleteID] = useState("");
    const deleteData = async (id = 0) => {
        setDeleteID(id);
        dispatch({ type: OPEN_DELETESWAL2, confirmDelete2: true });
    }
    const confirmDelete = async () => {
        setLoadSaving("Deleting...");
        const response = await http.delete(`/remove-dardetail?id=${deleteID}`);
        if (response.data.success) {
            toast.success(response.data.message);
            loadDARDetail(headerID, chapaID);
            loadDARDetailTime(chapaID, date);
        } else toast.error(response.data.message);
        dispatch({ type: OPEN_DELETESWAL2, confirmDelete2: false });
        setLoadSaving(false);
    }

    // modal
    const [openModalDARDetail, setOpenModalDARDetail] = useState(false);
    const [passDataDetail, setPassDataDetail] = useState({});
    async function modalCloseDARDetail(params) {
        setOpenModalDARDetail(false);
        setPassDataDetail({});
        if (params) {
            loadDARDetail(headerID, chapaID);
            loadDARDetailTime(chapaID, date);
        }
    }

    // useeffects
    useEffect(() => {
        if (passedData.id) {
            loadDARDetail(passedData.id, passedData.ChapaID);
            loadDARDetailTime(passedData.ChapaID, passedData.date);
            setPersonName(passedData.personName);
            setHeaderID(passedData.id);
            setChapaID(passedData.ChapaID);
            setDate(passedData.date);
            setFName(passedData.emp_fname);
            setMName(passedData.emp_mname);
            setLName(passedData.emp_lname);
            setExtName(passedData.emp_ext_name);
        }
    }, [openModal, passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <DeleteSwal2 maxWidth="xs" onClick={confirmDelete} />
            <AddDARDetail
                openModal={openModalDARDetail}
                onCloseModal={modalCloseDARDetail}
                passedData={passDataDetail}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={"DAR Detail Breakdown"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" component="h2">Employee: {personName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {/* <Typography variant="h5" component="h2">Time In: {timeIn}</Typography> */}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {/* <Typography variant="h5" component="h2">Time Out: {timeOut}</Typography> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" component="h2">Breakdown of Activity</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                            <Button variant="contained" color="success" size="medium" onClick={() => { addDARDetail() }}>Add Breakdown</Button>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Paper>
                                <CustomDataGrid
                                    columns={ColumnHeader}
                                    rows={constMappedData}
                                    maxHeight={450}
                                    height={350}
                                    slots={{ noRowsOverlay: NoData }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default DARBreakdownModal;
