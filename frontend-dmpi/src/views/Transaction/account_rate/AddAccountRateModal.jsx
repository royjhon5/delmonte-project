import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import http from "../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../hooks/globalQuery";

const AddAccountRateModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: accounttochargeList } = hookContainer('/get-accounttocharge');
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
    const [activitylink_id, setActivityLinkID] = useState('');
    const [st_rate, setSTRate] = useState('');
    const [ot_rate, setOTRate] = useState('');
    const [nd_rate, setNDRate] = useState('');
    const [ndot_rate, setNDOTRate] = useState('');

    const SaveOrUpdateData = async () => {
        const AccountRateData = {
            id: isToUpdate ? toUpdateData.id : 0,
            activitylink_id: activitylink_id,
            st_rate: st_rate,
            ot_rate: ot_rate,
            nd_rate: nd_rate,
            ndot_rate: ndot_rate,
        };
        try {
            const response = await http.post('/post-accountrate', AccountRateData);
            if (response.data.success) {
                clearData();
                RefreshData();
                toast.success('Data saved successfully.');
                CloseDialog();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };

    const clearData = () => {
        setActivityLinkID('');
        setSTRate('');
        setOTRate('');
        setNDRate('');
        setNDOTRate('');
    }

    useEffect(() => {
        if (isToUpdate) {
            setActivityLinkID(toUpdateData.activitylink_id);
            setSTRate(toUpdateData.st_rate);
            setOTRate(toUpdateData.ot_rate);
            setNDRate(toUpdateData.nd_rate);
            setNDOTRate(toUpdateData.ndot_rate);
        }
    }, [isToUpdate, toUpdateData])

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Account Rate" : "Add New Account Rate"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Activity" select value={activitylink_id} onChange={(e) => { setActivityLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {accounttochargeList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.activityname + " | " + option.gl_code + " | " + option.costcenter}
                            </option>
                        ))}
                    </TextField>
                    <TextField type="number" label="ST Rate" value={st_rate} onChange={(e) => { setSTRate(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField type="number" label="OT Rate" value={ot_rate} onChange={(e) => { setOTRate(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField type="number" label="ND Rate" value={nd_rate} onChange={(e) => { setNDRate(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField type="number" label="NDOT Rate" value={ndot_rate} onChange={(e) => { setNDOTRate(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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

AddAccountRateModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddAccountRateModal;
