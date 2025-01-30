import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../hooks/globalQuery";

const AddGroupLine = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: locationList } = hookContainer('/get-location');
    const { data: departmentList } = hookContainer('/get-department');
    const { data: groupList } = hookContainer('/get-group');
    const { data: activityList } = hookContainer('/get-activity');
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

    return (
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
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Location" select value={assigned_location_idlink} onChange={(e) => { setLocationLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {locationList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.location_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Department" select value={assigned_department_idlink} onChange={(e) => { setDepartmentLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {departmentList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.department_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Group" select value={assigned_group_idlink} onChange={(e) => { setGroupLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {groupList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.groupline_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Activity" select value={default_activity_idlink} onChange={(e) => { setActivityLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {activityList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.activityname}
                            </option>
                        ))}
                    </TextField>
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
    );
}

AddGroupLine.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddGroupLine;
