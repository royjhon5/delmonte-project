import { Box, Button, Grid, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../hooks/globalQuery";
import SearchAccountMasterModal from "./SearchAccountMaster";
import SearchIcon from '@mui/icons-material/Search';

const AddGroupLine = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: locationList } = hookContainer('/get-location');
    const { data: departmentList } = hookContainer('/get-department');
    const { data: groupList } = hookContainer('/get-group');
    // const { data: activityList } = hookContainer('/get-activity');
    const { data: accounttochargeList } = hookContainer('/get-accounttocharge');
    const open = useSelector((state) => state.customization.openCustomModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formData);
    const [chapa_id, setChapaID] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [extname, setExtname] = useState('');
    const [assigned_location_idlink, setLocationLinkID] = useState('');
    const [assigned_department_idlink, setDepartmentLinkID] = useState('');
    const [assigned_group_idlink, setGroupLinkID] = useState('');
    const [default_activity_idlink, setActivityLinkID] = useState('');
    const [activityname, setActivity] = useState('');
    const [gl_code, setGLCode] = useState('');
    const [costcenter, setCostCenter] = useState('');

    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        clearData();
    }
    const SaveOrUpdateData = async () => {
        const saveUpdateData = {
            id: isToUpdate ? toUpdateData.id : 0,
            chapa_id: chapa_id,
            firstname: firstname,
            lastname: lastname,
            middlename: middlename,
            extname: extname,
            assigned_location_idlink: assigned_location_idlink,
            assigned_department_idlink: assigned_department_idlink,
            assigned_group_idlink: assigned_group_idlink,
            default_activity_idlink: default_activity_idlink,
            activityname: activityname,
            gl_code: gl_code,
            costcenter: costcenter,
        };
        try {
            await saveUpdateDataExecute.mutateAsync(saveUpdateData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveUpdateDataExecute = useMutation({
        mutationFn: (saveUpdateData) => http.post('/post-employee', saveUpdateData),
        onSuccess: () => {
            toast.success('Data saved successfully.');
            clearData();
            RefreshData();
            CloseDialog();
        },
        onError: (error) => {
            toast.error(error)
        }
    });

    const clearData = async () => {
        setChapaID('');
        setFirstname('');
        setLastname('');
        setMiddlename('');
        setExtname('');
        setLocationLinkID('');
        setDepartmentLinkID('');
        setGroupLinkID('');
        setActivityLinkID('');
    }

    useEffect(() => {
        if (isToUpdate) {
            setChapaID(toUpdateData.chapa_id);
            setFirstname(toUpdateData.firstname);
            setLastname(toUpdateData.lastname);
            setMiddlename(toUpdateData.middlename);
            setExtname(toUpdateData.extname);
            setLocationLinkID(toUpdateData.assigned_location_idlink);
            setDepartmentLinkID(toUpdateData.assigned_department_idlink);
            setGroupLinkID(toUpdateData.assigned_group_idlink);
            setActivityLinkID(toUpdateData.default_activity_idlink);
        }
    }, [isToUpdate, toUpdateData])

    const [openModalSearchActivity, setOpenModalSearchActivity] = useState(false);
    async function modalCloseSearchActivity(params) {
        setOpenModalSearchActivity(false);
        if (params) {
            setActivity(params.activityname);
            setGLCode(params.gl_code);
            setCostCenter(params.costcenter);
            setActivityLinkID(params.activity_id_link);
        }
    }

    return (
        <>
            <SearchAccountMasterModal
                openModal={openModalSearchActivity}
                onCloseModal={modalCloseSearchActivity}
            />
            <CustomDialog
                open={open}
                maxWidth={'xs'}
                DialogTitles={isToUpdate ? "Update Employee List" : "Add New Employee List"}
                onClose={CloseDialog}
                DialogContents={
                    <Box sx={{ mt: 1 }}>
                        <TextField label="ChapaID" value={chapa_id} onChange={(e) => { setChapaID(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                        <TextField label="Firstname" value={firstname} onChange={(e) => { setFirstname(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                        <TextField label="Middlename" value={middlename} onChange={(e) => { setMiddlename(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                        <TextField label="Lastname" value={lastname} onChange={(e) => { setLastname(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                        <TextField label="Extname" value={extname} onChange={(e) => { setExtname(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                        <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Select Default Activity</InputLabel>
                            <OutlinedInput size="medium"
                                inputProps={{ readOnly: true }}
                                label="Select Default Activity"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button size="large" variant="contained" onClick={() => { setOpenModalSearchActivity(true) }}><SearchIcon fontSize="small" /></Button>
                                    </InputAdornment>
                                }
                                value={activityname} name="activityname"
                            />
                        </FormControl>
                    </Box>
                }
                DialogAction={
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {isToUpdate ?
                                <Button variant="contained" fullWidth onClick={SaveOrUpdateData}>Update Data</Button>
                                :
                                <Button variant="contained" fullWidth onClick={SaveOrUpdateData}>Save Data</Button>}
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

AddGroupLine.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddGroupLine;
