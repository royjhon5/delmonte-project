import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddSignatory = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        setSignatoryName('');
        setDesignation('');
    }
    const [signatoryName, setSignatoryName] = useState('');
    const [designation, setDesignation] = useState('');

    const SaveOrUpdateData = async () => {
        const FieldListData = {
            id: isToUpdate ? toUpdateData.id : 0,
            name: signatoryName,
            designation: designation
        };
        try {
            await saveNewFieldListData.mutateAsync(FieldListData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewFieldListData = useMutation({
        mutationFn: (FieldListData) => http.post('/save-signatory', FieldListData),
        onSuccess: () => {
            setSignatoryName('');
            setDesignation('');
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
            setSignatoryName(toUpdateData.name);
            setDesignation(toUpdateData.designation);
        }
    }, [isToUpdate, toUpdateData])

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Field List" : "Add New Field List"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Signatory" value={signatoryName} onChange={(e) => { setSignatoryName(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Designation" value={designation} onChange={(e) => { setDesignation(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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

AddSignatory.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddSignatory;
