import { Autocomplete, Box, Button, Grid, Popper, TextField } from "@mui/material";
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
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedGLCode, setSelectedGLCode] = useState(null);
    const [selectedCostCenter, setSelectedCostCenter] = useState(null);
    const SaveOrUpdateData = async () => {
        const AccountMasterData = {
            id: isToUpdate ? toUpdateData.id : 0,
            activity_id_link: selectedActivity ? selectedActivity.id : "",
            glcode_id_link: selectedGLCode ? selectedGLCode.id : "",
            costcenter_id_link: selectedCostCenter ? selectedCostCenter.id : "",
        };
        await saveNewAccountMasterData.mutateAsync(AccountMasterData);
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
            const errorMessage = error.response?.data?.error
            toast.error(errorMessage);
        }
    });

    useEffect(() => {
        if (isToUpdate && toUpdateData && activityList.length > 0) {
          const matchedActivity = activityList.find(activity => activity.id === toUpdateData.activity_id_link);    
          if (matchedActivity) {
            setSelectedActivity(matchedActivity);
          }
          const matchedGLCode = glCodeList.find(glcode => glcode.id === toUpdateData.glcode_id_link);    
          if (matchedGLCode) {
            setSelectedGLCode(matchedGLCode);
          }
          const matchedCostCenter = costCenterList.find(costcenter => costcenter.id === toUpdateData.costcenter_id_link);    
          if (matchedCostCenter) {
            setSelectedCostCenter(matchedCostCenter);
          }
        }
      }, [isToUpdate, toUpdateData, activityList, glCodeList, costCenterList]);

    const clearData = () => {
        setSelectedActivity(null);
        setSelectedGLCode(null);
        setSelectedCostCenter(null);
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Account Master" : "Add New Account Master"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1, display: 'flex', flexDirection:'column', gap:1 }}>
                    <Autocomplete 
                        disablePortal
                        options={activityList ?? []}
                        value={selectedActivity}
                        getOptionLabel={(option) => option.activityname || ''} 
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => setSelectedActivity(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Activity" />}
                        ListboxProps={{ style: { maxHeight: '200px', overflow: 'auto' } }}
                        PopperComponent={(props) => <Popper {...props} placement="bottom-start" disablePortal={false} />}
                    />

                    <Autocomplete 
                        disablePortal
                        options={glCodeList ?? []}
                        value={selectedGLCode}
                        getOptionLabel={(option) => option.gl_code || ''} 
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: '100%' }}
                        onChange={(event, newValue) => setSelectedGLCode(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select GL Code" />}
                        ListboxProps={{ style: { maxHeight: '200px', overflow: 'auto' } }}
                        PopperComponent={(props) => <Popper {...props} placement="bottom-start" disablePortal={false} />}
                    />

                    <Autocomplete 
                        disablePortal
                        options={costCenterList ?? []}
                        value={selectedCostCenter}
                        getOptionLabel={(option) => option.costcenter || ''} 
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: '100%' }}
                        onChange={(event, newValue) => setSelectedCostCenter(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select GL Code" />}
                        ListboxProps={{ style: { maxHeight: '200px', overflow: 'auto' } }}
                        PopperComponent={(props) => <Popper {...props} placement="bottom-start" disablePortal={false} />}
                    />

                    
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
