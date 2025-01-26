import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState } from "react";
import SearchTemplateModal from "./SearchTemplate.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import { hookContainer } from "../../../../hooks/globalQuery.jsx";

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
        xDate: "",
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
        activity: "",
        department: "",
        group_name: "",
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const clearData = async () => {
        setDataVariable(initialDataVariable);
    }

    const SaveOrUpdateData = async () => {
        setLoadSaving("Saving...");
        const response = await http.post('/post-darheader', { dataVariable });
        if (response.data.success) {
            var returnData = dataVariable;
            if(response.data.id) {
                returnData.id = response.data.id;
            }
            toast.success(response.data.message);
            onCloseModal(returnData); // close modal after saving
            setDataVariable(initialDataVariable); // set initial variables | clear fields
        } else toast.error(response.data.message);
        setLoadSaving(false);
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

    // useEffects
    useEffect(() => {
        if(passedData.id) setDataVariable(passedData);
    }, [passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchTemplateModal
                openModal={openModalTemplate}
                onCloseModal={modalClose}
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
                                <FormControl variant="filled" fullWidth>
                                    <InputLabel>Select Employee Template (Activity)</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Voucher Number"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalTemplate(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.activity} onChange={updateDataVariable} name="activity"
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
                                <TextField label="Prepared By" value={dataVariable.prepared_by} onChange={updateDataVariable} name="prepared_by" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Confirmed By" value={dataVariable.confirmed_by} onChange={updateDataVariable} name="confirmed_by" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" value={dataVariable.xDate} onChange={updateDataVariable} name="xDate" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Checked By" value={dataVariable.checked_by} onChange={updateDataVariable} name="checked_by" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Approved By" value={dataVariable.approved_by} onChange={updateDataVariable} name="approved_by" fullWidth sx={{ mt: 1 }} size="medium" />
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
