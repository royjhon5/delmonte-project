import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState, useCallback } from "react";
import SearchTemplateModal from "../../../../components/SearchMasterfile/SearchTemplate.jsx";
import SearchLocationModal from "../../../../components/SearchMasterfile/SearchLocation.jsx";
import SearchDepartmentModal from "../../../../components/SearchMasterfile/SearchDepartment.jsx";
import SearchClientModal from "../../../../components/SearchMasterfile/SearchClient.jsx";
import SearchSignatoryModal from "../../../../components/SearchMasterfile/SearchSignatory.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import dayjs from 'dayjs';

const NewDarHeader = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
        setDataVariable(initialDataVariable);
    }
    const [loadSaving, setLoadSaving] = useState(false);

    const [dayTypeList, setDayTypeList] = useState([]);
    const loadDayType = useCallback(async () => {
        const response = await http.get(`/get-daytype`);
        if (response.data.length > 0) {
            setDayTypeList(Array.isArray(response.data) ? response.data.map((row) => {
                return { ...row, id: row.id };
            }) : []);
        }
    }, []);

    useEffect(() => {
        if(openModal) loadDayType();
    }, [openModal]);

    const initialDataVariable = {
        id: "",
        soa_no_link: "",
        day_type_idlink: "",
        locationlink_id: "",
        xDate: dayjs().format('YYYY-MM-DD'),
        shift: "",
        dar_status: "ACTIVE",
        prepared_by: "",
        prepared_by_pos: "",
        approved_by: "",
        approved_by_pos: "",
        checked_by: "",
        checked_by_pos: "",
        confirmed_by: "",
        confirmed_by_pos: "",
        templatelink_id: "",
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
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name == 'day_type_idlink') {
            const selectedRow = filterIt(dayTypeList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                daytype: selectedRow[0].dt_name
            }));
        }
        // if (name == 'shift') {
        //     if (value == 1) {
        //         setDataVariable(prevState => ({
        //             ...prevState,
        //             shift_time_in_hour: "08",
        //             shift_time_in_min: "00",
        //             shift_time_out_hour: "16",
        //             shift_time_out_min: "00",
        //         }));
        //     }
        //     if (value == 2) {
        //         setDataVariable(prevState => ({
        //             ...prevState,
        //             shift_time_in_hour: "18",
        //             shift_time_in_min: "00",
        //             shift_time_out_hour: "02",
        //             shift_time_out_min: "00",
        //         }));
        //     }
        // }
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

    const SaveOrUpdateData = async () => {
        setLoadSaving("Saving...");
        const response = await http.post('/post-darheader', { dataVariable });
        if (response.data.success) {
            var returnData = dataVariable;
            if (response.data.id) {
                returnData.id = response.data.id;
                returnData.dar_no = response.data.dar_no;
            }
            toast.success(response.data.message);
            onCloseModal(returnData); // close modal after saving
            setDataVariable(initialDataVariable); // set initial variables | clear fields
        } else toast.error(response.data.message);
        setLoadSaving(false);
    }

    const [signatoryType, setSignatoryType] = useState(false);
    const selectSignatory = (type) => {
        setSignatoryType(type);
        setOpenSignatoryModal(true);
    }

    // modal
    // group template
    const [openModalTemplate, setOpenModalTemplate] = useState(false);
    async function modalClose(params) {
        setOpenModalTemplate(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                templatelink_id: params.id,
                group_name: params.emp_group,
                location: params.location,
                locationlink_id: params.location_idlink,
                department: params.department,
                departmend_id: params.department_idlink,
                client_name: params.client_name,
                client_id: params.client_id,
            }));
        }
    }

    // location
    const [openModalTemplateLocation, setOpenModalTemplateLocation] = useState(false);
    async function modalCloseLocation(params) {
        setOpenModalTemplateLocation(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                locationlink_id: params.id,
                location: params.location_name,
            }));
        }
    }

    // department
    const [openModalTemplateDepartment, setOpenModalTemplateDepartment] = useState(false);
    async function modalCloseDepartment(params) {
        setOpenModalTemplateDepartment(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                departmend_id: params.id,
                department: params.department_name,
            }));
        }
    }

    // client
    const [openModalTemplateClient, setOpenModalTemplateClient] = useState(false);
    async function modalCloseClient(params) {
        setOpenModalTemplateClient(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                client_id: params.id,
                client_name: params.client_name,
            }));
        }
    }

    const [openSignatoryModal, setOpenSignatoryModal] = useState(false);
    async function modalCloseSignatoryModal(params) {
        setOpenSignatoryModal(false);
        if (params) {
            if (signatoryType == 1) {
                setDataVariable(prevState => ({
                    ...prevState,
                    prepared_by: params.name,
                    prepared_by_pos: params.designation,
                }));
            }
            if (signatoryType == 2) {
                setDataVariable(prevState => ({
                    ...prevState,
                    approved_by: params.name,
                    approved_by_pos: params.designation,
                }));
            }
            if (signatoryType == 3) {
                setDataVariable(prevState => ({
                    ...prevState,
                    checked_by: params.name,
                    checked_by_pos: params.designation,
                }));
            }
            if (signatoryType == 4) {
                setDataVariable(prevState => ({
                    ...prevState,
                    confirmed_by: params.name,
                    confirmed_by_pos: params.designation,
                }));
            }
        }
    }

    // useEffects
    useEffect(() => {
        if (passedData.id) setDataVariable(passedData);
    }, [passedData]);

    useEffect(() => {
        if (dataVariable.shift_time_in_hour && dataVariable.shift_time_in_min && dataVariable.shift_time_out_hour && dataVariable.shift_time_out_min) {
            let timeInDateTime = "2025-01-01 " + dataVariable.shift_time_in_hour + ":" + dataVariable.shift_time_in_min;
            let timeOutDateTime = "2025-01-01 " + dataVariable.shift_time_out_hour + ":" + dataVariable.shift_time_out_min;
            if (parseInt(dataVariable.shift_time_in_hour) > parseInt(dataVariable.shift_time_out_hour)) {
                timeOutDateTime = "2025-01-02 " + dataVariable.shift_time_out_hour + ":" + dataVariable.shift_time_out_min; // next time in of that employee
            }
            let diff = diff_hours(timeInDateTime, timeOutDateTime);
            function diff_hours(dt2, dt1) {
                dt2 = new Date(dt2);
                dt1 = new Date(dt1);
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60);
                // Return the absolute value of the rounded difference in hours
                return Math.abs(diff.toFixed(2));
            }
            setDataVariable(prevState => ({
                ...prevState,
                totalHours: diff
            }));
        } else {
            setDataVariable(prevState => ({
                ...prevState,
                totalHours: 0
            }));
        }
    }, [dataVariable.shift_time_in_hour, dataVariable.shift_time_in_min, dataVariable.shift_time_out_hour, dataVariable.shift_time_out_min]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchTemplateModal
                openModal={openModalTemplate}
                onCloseModal={modalClose}
            />
            <SearchLocationModal
                openModal={openModalTemplateLocation}
                onCloseModal={modalCloseLocation}
            />
            <SearchDepartmentModal
                openModal={openModalTemplateDepartment}
                onCloseModal={modalCloseDepartment}
            />
            <SearchClientModal
                openModal={openModalTemplateClient}
                onCloseModal={modalCloseClient}
            />
            <SearchSignatoryModal
                openModal={openSignatoryModal}
                onCloseModal={modalCloseSignatoryModal}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'xl'}
                DialogTitles={passedData.id ? "Update DAR Header" : "Add New DAR Header"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={4}>
                                <TextField label="DAR #" value={dataVariable.dar_no} onChange={updateDataVariable} name="dar_no" fullWidth size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Group</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Group"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplate(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.group_name} onChange={updateDataVariable} name="group_name"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Client</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Client"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateClient(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.client_name} onChange={updateDataVariable} name="client_name"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Location</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Location"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateLocation(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.location} onChange={updateDataVariable} name="location"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Department</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Department"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateDepartment(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.department} onChange={updateDataVariable} name="department"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField type="date" label="DAR Date" value={dataVariable.xDate} onChange={updateDataVariable} name="xDate" fullWidth size="medium" />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={4}>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Day Type" select value={dataVariable.day_type_idlink} onChange={updateDataVariable} name="day_type_idlink" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {dayTypeList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.dt_name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Shift" select value={dataVariable.shift} onChange={updateDataVariable} name="shift" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            <Grid item xs={12} md={12}>
                                <Divider>SHIFT SCHEDULE</Divider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" component="h2">Time In</Typography>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Hour" select value={dataVariable.shift_time_in_hour} onChange={updateDataVariable} name="shift_time_in_hour" SelectProps={{ native: true, }}>
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
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Minute" select value={dataVariable.shift_time_in_min} onChange={updateDataVariable} name="shift_time_in_min" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" component="h2">Time Out</Typography>
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Hour" select value={dataVariable.shift_time_out_hour} onChange={updateDataVariable} name="shift_time_out_hour" SelectProps={{ native: true, }}>
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
                                <TextField sx={{ mt: 1, width: 200 }} size="medium" label="Select Minute" select value={dataVariable.shift_time_out_min} onChange={updateDataVariable} name="shift_time_out_min" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ marginTop: 4 }}>
                                <TextField type="number" step="0.01" label="Total Hours" value={dataVariable.totalHours} onChange={updateDataVariable} name="totalHours" fullWidth size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            <Grid item xs={12} md={12}>
                                <Divider>SIGNATORIES</Divider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Prepared By</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Prepared By"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { selectSignatory(1) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.prepared_by} onChange={updateDataVariable} name="prepared_by"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Reviewed By</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Reviewed By"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { selectSignatory(3) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.checked_by} onChange={updateDataVariable} name="checked_by"
                                    />
                                </FormControl>
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

export default NewDarHeader;
