import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_DAYTYPE_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddDayTypeModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openDayTypeModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.dayTypeData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_DAYTYPE_MODAL, openDayTypeModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        setDayType('');
    }
    const [DayType, setDayType] = useState('');

    const SaveOrUpdateData = async () => {
        const DayTypeData = {
            id: isToUpdate ? toUpdateData.id : 0,
            dt_name: DayType,
        };
        try {
            await saveNewDayTypeData.mutateAsync(DayTypeData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewDayTypeData = useMutation({
        mutationFn: (DayTypeData) => http.post('/post-daytype', DayTypeData),
        onSuccess: () => {
            setDayType('');
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
            setDayType(toUpdateData.dt_name);
        }
    }, [isToUpdate, toUpdateData])

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update DayType" : "Add New DayType"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="DayType" value={DayType} onChange={(e) => { setDayType(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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
