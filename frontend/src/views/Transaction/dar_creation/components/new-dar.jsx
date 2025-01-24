import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_HEADER_FORM, OPEN_NEW_DAR, SEARCH_SELECTED_DATA } from "../../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useEffect, useState } from "react";

const NewDarHeader = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openNewDar);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateHeaderForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formHeaderData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_NEW_DAR, openNewDar: false });
        dispatch({ type: IS_UPDATE_HEADER_FORM, isUpdateHeaderForm: false });
        clearData();
    }
    const [DType, setDType] = useState('');
    const [PrepBy, setPrepBy] = useState('');
    const [CheckBy, setCheckBy] = useState('');
    const [ConfirmBy, setConfirmBy] = useState('');
    const [ApprovedBy, setApprovedBy] = useState('');
    const [Date, setDate] = useState('');

    const SaveOrUpdateData = async () => {
        var formVariable = {
            id: isToUpdate ? toUpdateData.id : 0,
            TName: DType,
            account_master_idlink: PrepBy,
            location_idlink: CheckBy,
            department_idlink: ConfirmBy,
            group_idlink: ApprovedBy,
            shifting: Date,
        };
        try {
            await saveNewformVariable.mutateAsync(formVariable);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewformVariable = useMutation({
        mutationFn: async (formVariable) => {
            const response = await http.post('/post-employeetemplateheader', formVariable);
            if(response.data.id) formVariable.id = response.data.id;
            dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: formVariable });
        },
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
            setDType(toUpdateData.TName);
            setPrepBy(toUpdateData.account_master_idlink);
            setCheckBy(toUpdateData.location_idlink);
            setConfirmBy(toUpdateData.department_idlink);
            setApprovedBy(toUpdateData.group_idlink);
            setDate(toUpdateData.shifting);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setDType('');
        setPrepBy('');
        setCheckBy('');
        setConfirmBy('');
        setApprovedBy('');
        setDate('');
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Template Header" : "Add New Template Header"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Day Type" value={DType} onChange={(e) => { setDType(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Prepared By" value={PrepBy} onChange={(e) => { setPrepBy(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Checked By" value={CheckBy} onChange={(e) => { setCheckBy(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Confirmed By" value={ConfirmBy} onChange={(e) => { setConfirmBy(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField label="Approved By" value={ApprovedBy} onChange={(e) => { setApprovedBy(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField type="date" value={Date} onChange={(e) => { setDate(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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

NewDarHeader.propTypes = {
    RefreshData: PropTypes.func,
}

export default NewDarHeader;
