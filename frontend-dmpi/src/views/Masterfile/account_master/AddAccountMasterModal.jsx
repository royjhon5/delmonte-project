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

const AddAccountMasterModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: activityList } = hookContainer('/get-activity');
    const { data: glCodeList } = hookContainer('/get-glcode');
    const { data: costCenterList } = hookContainer('/get-costcenter');
    const open = useSelector((state) => state.customization.openCustomModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        clearData();
    }
    const [activity_id_link, setActivityLinkID] = useState('');
    const [glcode_id_link, setGLCodeLinkID] = useState('');
    const [costcenter_id_link, setCostCenterLinkID] = useState('');

    const SaveOrUpdateData = async () => {
        const AccountMasterData = {
            id: isToUpdate ? toUpdateData.id : 0,
            activity_id_link: activity_id_link,
            glcode_id_link: glcode_id_link,
            costcenter_id_link: costcenter_id_link,
        };
        try {
            await saveNewAccountMasterData.mutateAsync(AccountMasterData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewAccountMasterData = useMutation({
        mutationFn: (AccountMasterData) => http.post('/post-accounttocharge', AccountMasterData),
        onSuccess: () => {
            clearData();
            RefreshData();
            toast.success('Data saved successfully.');
            CloseDialog();
        },
        onError: (error) => {
            toast.error(error)
        }
    });

    useEffect(() => {
        if (isToUpdate) {
            setActivityLinkID(toUpdateData.activity_id_link);
            setGLCodeLinkID(toUpdateData.glcode_id_link);
            setCostCenterLinkID(toUpdateData.costcenter_id_link);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setActivityLinkID('');
        setGLCodeLinkID('');
        setCostCenterLinkID('');
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Account Master" : "Add New Account Master"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Activity" select value={activity_id_link} onChange={(e) => { setActivityLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {activityList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.activityname}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select GL Code" select value={glcode_id_link} onChange={(e) => { setGLCodeLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {glCodeList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.gl_code}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Cost Center" select value={costcenter_id_link} onChange={(e) => { setCostCenterLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {costCenterList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.costcenter}
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

AddAccountMasterModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddAccountMasterModal;
