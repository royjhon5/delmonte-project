import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState } from "react";
import SearchTemplateModal from "./SearchTemplate.jsx";
import SearchSignatoryModal from "./SearchSignatory.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import { hookContainer } from "../../../../hooks/globalQuery.jsx";
import dayjs from 'dayjs';

const NewDarHeader = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
        setDataVariable(initialDataVariable);
    }
    const [loadSaving, setLoadSaving] = useState(false);

    const { data: locationList } = hookContainer('/get-location');
    const { data: dayTypeList } = hookContainer('/get-daytype');

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
        template_name: "",
        department: "",
        group_name: "",
        location: "",
        daytype: "",
        dar_no: "",
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name == 'locationlink_id') {
            const selectedRow = filterIt(locationList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                location: selectedRow[0].location_name
            }));
        }
        if (name == 'day_type_idlink') {
            const selectedRow = filterIt(dayTypeList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                daytype: selectedRow[0].dt_name
            }));
        }
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
    const [openModalTemplate, setOpenModalTemplate] = useState(false);
    async function modalClose(params) {
        setOpenModalTemplate(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                templatelink_id: params.id,
                template_name: params.TName,
                activity: params.activityname,
                department: params.department,
                group_name: params.emp_group,
                shift: params.shifting,
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

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchTemplateModal
                openModal={openModalTemplate}
                onCloseModal={modalClose}
            />
            <SearchSignatoryModal
                openModal={openSignatoryModal}
                onCloseModal={modalCloseSignatoryModal}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={passedData.id ? "Update DAR Header" : "Add New DAR Header"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Employee Template</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Employee Template"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplate(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.template_name} onChange={updateDataVariable} name="template_name"
                                    />
                                </FormControl>
                                <TextField label="Department" value={dataVariable.department} onChange={updateDataVariable} name="department" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Group" value={dataVariable.group_name} onChange={updateDataVariable} name="group_name" fullWidth size="medium" inputProps={{ readOnly: true }} />
                                <TextField label="Shifting" value={dataVariable.shift} onChange={updateDataVariable} name="shift" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Location" select value={dataVariable.locationlink_id} onChange={updateDataVariable} name="locationlink_id" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {locationList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.location_name}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Day Type" select value={dataVariable.day_type_idlink} onChange={updateDataVariable} name="day_type_idlink" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {dayTypeList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.dt_name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" value={dataVariable.xDate} onChange={updateDataVariable} name="xDate" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
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
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Confirmed By</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Confirmed By"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { selectSignatory(4) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.confirmed_by} onChange={updateDataVariable} name="confirmed_by"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Checked By</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Checked By"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { selectSignatory(3) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.checked_by} onChange={updateDataVariable} name="checked_by"
                                    />
                                </FormControl>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Approved By</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Approved By"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { selectSignatory(2) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.approved_by} onChange={updateDataVariable} name="approved_by"
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
