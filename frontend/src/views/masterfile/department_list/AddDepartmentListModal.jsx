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

const AddDepartmentListModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: clientList } = hookContainer('/get-client');
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
    const [DepartmentList, setDepartmentList] = useState('');
    const [client_idlink, setClientLinkID] = useState('');

    const SaveOrUpdateData = async () => {
        const DepartmentListData = {
            id: isToUpdate ? toUpdateData.id : 0,
            department_name: DepartmentList,
            client_idlink: client_idlink,
        };
        try {
            await saveNewDepartmentListData.mutateAsync(DepartmentListData);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save.');
        }
    };
    const saveNewDepartmentListData = useMutation({
        mutationFn: (DepartmentListData) => http.post('/post-department', DepartmentListData),
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
            setDepartmentList(toUpdateData.department_name);
            setClientLinkID(toUpdateData.client_idlink);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setDepartmentList('');
        setClientLinkID('');
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Department" : "Add New Department"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Department" value={DepartmentList} onChange={(e) => { setDepartmentList(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Client" select value={client_idlink} onChange={(e) => { setClientLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {clientList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.client_name}
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

AddDepartmentListModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddDepartmentListModal;
