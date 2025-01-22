import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddDayTypeModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
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
    const [client_code, setClientCode] = useState('');
    const [client_name, setClientName] = useState('');
    const [client_address, setClientAddress] = useState('');
    const [client_contactno, setContactNo] = useState('');
    const [client_email, setEmail] = useState('');
    const [client_tinno, setTINNo] = useState('');

    const SaveOrUpdateData = async () => {
        const DayTypeData = {
            id: isToUpdate ? toUpdateData.id : 0,
            client_code: client_code,
            client_name: client_name,
            client_address: client_address,
            client_contactno: client_contactno,
            client_email: client_email,
            client_tinno: client_tinno
        };
        try {
            await saveNewDayTypeData.mutateAsync(DayTypeData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewDayTypeData = useMutation({
        mutationFn: (DayTypeData) => http.post('/post-client', DayTypeData),
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
            setClientCode(toUpdateData.client_code);
            setClientName(toUpdateData.client_name);
            setClientAddress(toUpdateData.client_address);
            setContactNo(toUpdateData.client_contactno);
            setEmail(toUpdateData.client_email);
            setTINNo(toUpdateData.client_tinno);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setClientCode('');
        setClientName('');
        setClientAddress('');
        setContactNo('');
        setEmail('');
        setTINNo('');
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Client" : "Add New Client"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Code" value={client_code} onChange={(e) => { setClientCode(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Client Name" value={client_name} onChange={(e) => { setClientName(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Address" value={client_address} onChange={(e) => { setClientAddress(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Contact No" value={client_contactno} onChange={(e) => { setContactNo(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Email" value={client_email} onChange={(e) => { setEmail(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="TIN No" value={client_tinno} onChange={(e) => { setTINNo(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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

AddDayTypeModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddDayTypeModal;
