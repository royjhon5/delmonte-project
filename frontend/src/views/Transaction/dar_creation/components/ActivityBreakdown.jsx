import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider, Typography, Box, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState, useCallback } from "react";
import SearchEmployeeModal from "./SearchEmployee.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import SearchAccountMasterModal from "./SearchAccountMaster.jsx";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import SearchGLCodeModal from "../../../../components/SearchMasterfile/SearchGLCode.jsx";
import SearchCostCenterModal from "../../../../components/SearchMasterfile/SearchCostCenter.jsx";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ActivityBreakdown = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
        setDataVariable(initialDataVariable);
    }
    const [loadSaving, setLoadSaving] = useState(false);

    const initialDataVariable = {
        dar_idlink: "",
        time_in: "",
        time_out: "",
        st: "",
        ot: "",
        nd: "",
        ndot: "",
        gl: "",
        cost_center: "",
        activitylink_id: "",
        activity: "",
        is_main: 0,
        costcenterlink_id: "",
        glcodelink_id: "",
        empids: [],
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function filterIt(arr, searchKey, keyValue = false) {
        return arr.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                if (obj[(keyValue ? keyValue : key)].toString().includes(searchKey)) return obj;
            })
        });
    }

    const clearData = async () => {
        setDataVariable(initialDataVariable);
    }

    const [selectedRows, setSelectedRows] = useState([]);
    const handleSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    const SaveOrUpdateData = async () => {
        let chapaList = [];
        constMappedDataTo.map(element => {
            chapaList.push(element.ChapaID);
        });
        if(chapaList.length == 0) return toast.error("No employee/s selected.");
        setLoadSaving("Saving...");
        let toSaveParams = dataVariable;
        toSaveParams.empids = chapaList;
        const response = await http.post('/post-dardetailbreakdown', { dataVariable: toSaveParams });
        if (response.data.success) {
            toast.success(response.data.message);
            onCloseModal(dataVariable); // close modal after saving
            setDataVariable(initialDataVariable); // set initial variables | clear fields
        } else toast.error(response.data.message);
        setLoadSaving(false);
    }

    // for time in and time out
    const [time_in_hr, setTimeInHr] = useState("");
    const [time_in_min, setTimeInMin] = useState("");
    const [time_out_hr, setTimeOutHr] = useState("");
    const [time_out_min, setTimeOutMin] = useState("");

    const changeToOT = () => {
        setDataVariable(prevState => ({
            ...prevState,
            st: 0,
            ot: dataVariable.st,
        }));
    };

    const changeToST = () => {
        setDataVariable(prevState => ({
            ...prevState,
            st: dataVariable.ot,
            ot: 0,
        }));
    };

    const bulkAppend = async () => {
        let temp = [...constMappedDataTo];
        selectedRows.map(element => {
            temp.push(constMappedDataFrom.filter(item => item.id == element)[0]);
            setConstMappedDataFrom(prevState => prevState.filter(item => item.id !== element)); // remove
        })
        setConstMappedDataTo(temp); // add
    }

    // table
    const [constMappedDataFrom, setConstMappedDataFrom] = useState([]);
    const loadDARDetailGroup = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-dardetail?header_id=${headerID}&group=true`);
        setConstMappedDataFrom(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);
    const [searchFrom, setSearchFrom] = useState('');
    const SearchFilterFrom = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(searchFrom.toLowerCase()) ||
            row.emp_lname.toLowerCase().includes(searchFrom.toLowerCase())
        );
    };
    const ColumnHeaderFrom = [
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 150,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'fullname', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const selectedRow = () => {
                    setConstMappedDataTo([
                        ...constMappedDataTo,
                        params.row,
                    ]);
                    setConstMappedDataFrom(prevState => prevState.filter(item => item !== params.row));
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <IconButton color="primary" size="small" onClick={() => selectedRow()}>
                            APPEND
                        </IconButton>
                    </Box>
                )
            }
        }
    ];

    const [constMappedDataTo, setConstMappedDataTo] = useState([]);
    const [searchTo, setSearchTo] = useState('');
    const SearchFilterTo = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(searchTo.toLowerCase()) ||
            row.emp_lname.toLowerCase().includes(searchTo.toLowerCase())
        );
    };
    const ColumnHeaderTo = [
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 150,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'fullname', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const selectedRow = () => {
                    setConstMappedDataFrom([
                        ...constMappedDataFrom,
                        params.row,
                    ]);
                    setConstMappedDataTo(prevState => prevState.filter(item => item !== params.row));
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <IconButton color="error" size="small" onClick={() => selectedRow()}>
                            REMOVE
                        </IconButton>
                    </Box>
                )
            }
        }
    ];

    // modal
    const [openModalEmployee, setOpenModalEmployee] = useState(false);
    async function modalClose(params) {
        setOpenModalEmployee(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                ChapaID: params.chapa_id,
                emp_lname: params.lastname,
                emp_fname: params.firstname,
                emp_mname: params.middlename,
                emp_ext_name: params.extname,
            }));
        }
    }

    const [openModalSearchActivity, setOpenModalSearchActivity] = useState(false);
    async function modalCloseSearchActivity(params) {
        setOpenModalSearchActivity(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                activitylink_id: params.id,
                activity: params.activity,
                cost_center: params.costcenter,
                gl: params.gl_code
            }));
        }
    }

    const [openModalSearchGLCode, setOpenModalSearchGLCode] = useState(false);
    async function modalCloseSearchGLCode(params) {
        setOpenModalSearchGLCode(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                glcodelink_id: params.id,
                gl: params.gl_code
            }));
        }
    }

    const [openModalSearchCostCenter, setOpenModalSearchCostCenter] = useState(false);
    async function modalCloseSearchCostCenter(params) {
        setOpenModalSearchCostCenter(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                costcenterlink_id: params.id,
                cost_center: params.costcenter,
            }));
        }
    }

    // useEffects
    useEffect(() => {
        if (passedData.id) {
            setDataVariable(passedData);
            setTimeInHr(passedData.time_in.substring(0, 2));
            setTimeInMin(passedData.time_in.substring(2, 4));
            setTimeOutHr(passedData.time_out.substring(0, 2));
            setTimeOutMin(passedData.time_out.substring(2, 4));
        }
        else if (passedData.ChapaID) {
            setDataVariable(passedData);
            setTimeInHr("");
            setTimeInMin("");
            setTimeOutHr("");
            setTimeOutMin("");
        }
        else if (passedData.dar_idlink) {
            setDataVariable(prevState => ({
                ...prevState,
                dar_idlink: passedData.dar_idlink
            }));
            loadDARDetailGroup(passedData.dar_idlink);
            setConstMappedDataTo([]);
        }
    }, [passedData]);

    useEffect(() => {
        if (time_in_hr && time_in_min) {
            setDataVariable(prevState => ({
                ...prevState,
                time_in: time_in_hr + "" + time_in_min,
            }));
        } else {
            setDataVariable(prevState => ({
                ...prevState,
                time_in: "",
            }));
        }
        if (time_out_hr && time_out_min) {
            setDataVariable(prevState => ({
                ...prevState,
                time_out: time_out_hr + "" + time_out_min,
            }));
        } else {
            setDataVariable(prevState => ({
                ...prevState,
                time_out: "",
            }));
        }
        if (time_in_hr && time_in_min && time_out_hr && time_out_min) {
            let timeInDateTime = "2025-01-01 " + time_in_hr + ":" + time_in_min;
            let timeOutDateTime = "2025-01-01 " + time_out_hr + ":" + time_out_min;
            if (parseInt(time_in_hr + "" + time_in_min) > parseInt(time_out_hr + "" + time_out_min)) { // meaning time returns to midnight or the next day
                timeOutDateTime = "2025-01-02 " + time_out_hr + ":" + time_out_min;
            }
            let ST = parseFloat(diff_hours(timeInDateTime, timeOutDateTime));
            setDataVariable(prevState => ({
                ...prevState,
                st: ST,
            }));
            function diff_hours(dt2, dt1) {
                dt2 = new Date(dt2);
                dt1 = new Date(dt1);
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60);
                // Return the absolute value of the rounded difference in hours
                return Math.abs(diff.toFixed(2));
            }
        }
    }, [time_in_hr, time_in_min, time_out_hr, time_out_min]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchEmployeeModal
                openModal={openModalEmployee}
                onCloseModal={modalClose}
            />
            <SearchAccountMasterModal
                openModal={openModalSearchActivity}
                onCloseModal={modalCloseSearchActivity}
            />
            <SearchGLCodeModal
                openModal={openModalSearchGLCode}
                onCloseModal={modalCloseSearchGLCode}
            />
            <SearchCostCenterModal
                openModal={openModalSearchCostCenter}
                onCloseModal={modalCloseSearchCostCenter}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'xl'}
                DialogTitles={passedData.id ? "Update Activity Breakdown" : "Add New Activity Breakdown"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={5}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={8}>
                                        <TextField variant='outlined' label="Search" size='small' value={searchFrom} onChange={(e) => { setSearchFrom(e.target.value) }} sx={{ width: { xl: '80%', lg: '80%' } }} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button variant="contained" color="primary" fullWidth onClick={() => { bulkAppend() }}>Bulk Append</Button>
                                    </Grid>
                                </Grid>
                                <CustomDataGrid
                                    columns={ColumnHeaderFrom}
                                    rows={SearchFilterFrom(constMappedDataFrom)}
                                    maxHeight={300}
                                    height={300}
                                    slots={{ noRowsOverlay: NoData }}
                                    checkboxSelection={true}
                                    onRowSelectionModelChange={handleSelectionChange}
                                    disableRowSelectionOnClick={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} sx={{ textAlign: 'center', marginTop: '8%' }}>
                                <CompareArrowsIcon color="primary" sx={{ fontSize: 100 }} />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <TextField variant='outlined' label="Search" size='small' value={searchTo} onChange={(e) => { setSearchTo(e.target.value) }} sx={{ width: { xl: '50%', lg: '50%' } }} />
                                <CustomDataGrid
                                    columns={ColumnHeaderTo}
                                    rows={SearchFilterTo(constMappedDataTo)}
                                    maxHeight={300}
                                    height={300}
                                    slots={{ noRowsOverlay: NoData }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider>Activty | GL Code | Cost Center</Divider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select Activity</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Activity"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchActivity(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.activity} name="activity"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select GL Code</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select GL Code"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchGLCode(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.gl} name="gl"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select Cost Center</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Cost Center"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchCostCenter(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.cost_center} name="cost_center"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider>Time Schedule</Divider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" component="h2">Time In</Typography>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Hour" select value={time_in_hr} onChange={(e) => { setTimeInHr(e.target.value) }} name="time_in_hr" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                </TextField>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Minute" select value={time_in_min} onChange={(e) => { setTimeInMin(e.target.value) }} name="time_in_min" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </TextField>
                                <TextField label="Time In" value={dataVariable.time_in} onChange={updateDataVariable} name="time_in" fullWidth sx={{ mt: 1, width: 300, marginLeft: "10px" }} size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h5" component="h2">Time Out</Typography>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Hour" select value={time_out_hr} onChange={(e) => { setTimeOutHr(e.target.value) }} name="time_out_hr" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                </TextField>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Minute" select value={time_out_min} onChange={(e) => { setTimeOutMin(e.target.value) }} name="time_out_min" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </TextField>
                                <TextField label="Time Out" value={dataVariable.time_out} onChange={updateDataVariable} name="time_out" fullWidth sx={{ mt: 1, width: 300, marginLeft: "10px" }} size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>ST</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="ST"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { changeToOT(true) }}>Change to OT</Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.st} onChange={updateDataVariable} name="st"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ND" type="number" step="0.01" value={dataVariable.nd} onChange={updateDataVariable} name="nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>OT</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="OT"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { changeToST() }}>Change to ST</Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.ot} onChange={updateDataVariable} name="ot"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NDOT" type="number" step="0.01" value={dataVariable.ndot} onChange={updateDataVariable} name="ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                    </>
                }
                DialogAction={
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            {passedData.id ?
                                <Button variant="contained" color="success" fullWidth onClick={SaveOrUpdateData}>Update Data</Button>
                                :
                                <Button variant="contained" color="success" fullWidth onClick={SaveOrUpdateData}>Save Data</Button>}
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" fullWidth onClick={() => { closeCurrentModal() }}>Cancel</Button>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default ActivityBreakdown;
