import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddActivityList = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        setActivityList('');
    }
    const [ActivityList, setActivityList] = useState('');

    const SaveOrUpdateData = async () => {
        const ActivityListData = {
            id: isToUpdate ? toUpdateData.id : 0,
            activityname: ActivityList,
        };
        await saveNewActivityListData.mutateAsync(ActivityListData);
    };
    const saveNewActivityListData = useMutation({
        mutationFn: (ActivityListData) => http.post('/post-activity', ActivityListData),
        onSuccess: () => {
            setActivityList('');
            RefreshData();
            toast.success('Data saved successfully.');
            CloseDialog();
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.error
            toast.error(errorMessage);
        }
    });

    useEffect(() => {
        if (isToUpdate) {
            setActivityList(toUpdateData.activityname);
        }
    }, [isToUpdate, toUpdateData])

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Activity" : "Add New Activity"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Activity" value={ActivityList} onChange={(e) => { setActivityList(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
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

AddActivityList.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddActivityList;
