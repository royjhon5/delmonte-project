import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_HEADER_FORM, OPEN_CUSTOM_HEADER_MODAL, SEARCH_SELECTED_DATA } from "../../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";

const HeaderModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const { data: accounttochargeList } = hookContainer('/get-accounttocharge');
    const { data: departmentList } = hookContainer('/get-department');
    const { data: groupList } = hookContainer('/get-group');
    const open = useSelector((state) => state.customization.openCustomHeaderModal);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateHeaderForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formHeaderData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_HEADER_MODAL, openCustomHeaderModal: false });
        dispatch({ type: IS_UPDATE_HEADER_FORM, isUpdateHeaderForm: false });
        clearData();
    }
    const [TName, setTName] = useState('');
    const [account_master_idlink, setAccountMasterLinkID] = useState('');
    const [location_idlink, setLocationLinkID] = useState('');
    const [department_idlink, setDepartmentLinkID] = useState('');
    const [group_idlink, setGroupLinkID] = useState('');
    const [shifting, setShifting] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [emp_group, setGroup] = useState('');
    const [activityname, setActivity] = useState('');
    const [gl_code, setGLCode] = useState('');
    const [costcenter, setCostCenter] = useState('');

    const SaveOrUpdateData = async () => {
        var formVariable = {
            id: isToUpdate ? toUpdateData.id : 0,
            TName: TName,
            account_master_idlink: account_master_idlink,
            location_idlink: location_idlink,
            department_idlink: department_idlink,
            group_idlink: group_idlink,
            shifting: shifting,
            location: location,
            department: department,
            emp_group: emp_group,
            activityname: activityname,
            gl_code: gl_code,
            costcenter: costcenter,
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
            setTName(toUpdateData.TName);
            setAccountMasterLinkID(toUpdateData.account_master_idlink);
            setLocationLinkID(toUpdateData.location_idlink);
            setDepartmentLinkID(toUpdateData.department_idlink);
            setGroupLinkID(toUpdateData.group_idlink);
            setShifting(toUpdateData.shifting);
            setLocation(toUpdateData.location);
            setDepartment(toUpdateData.department);
            setGroup(toUpdateData.emp_group);
            setActivity(toUpdateData.activityname);
            setGLCode(toUpdateData.gl_code);
            setCostCenter(toUpdateData.costcenter);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setTName('');
        setAccountMasterLinkID('');
        setLocationLinkID('');
        setDepartmentLinkID('');
        setGroupLinkID('');
        setShifting('');
        setLocation('');
        setDepartment('');
        setGroup('');
        setActivity('');
        setGLCode('');
        setCostCenter('');
    }

    return (
        <CustomDialog
            open={open}
            maxWidth={'xs'}
            DialogTitles={isToUpdate ? "Update Template Header" : "Add New Template Header"}
            onClose={CloseDialog}
            DialogContents={
                <Box sx={{ mt: 1 }}>
                    <TextField label="Template Name" value={TName} onChange={(e) => { setTName(e.target.value) }} fullWidth sx={{ mt: 1 }} size="medium" />
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Activity" select value={account_master_idlink} onChange={(e) => { setAccountMasterLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {accounttochargeList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.activityname + " | " + option.gl_code + " | " + option.costcenter}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Department" select value={department_idlink} onChange={(e) => { setDepartmentLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {departmentList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.department_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Group" select value={group_idlink} onChange={(e) => { setGroupLinkID(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        {groupList?.map((option) => (
                            <option key={option.id} value={`${option.id}`}>
                                {option.groupline_name}
                            </option>
                        ))}
                    </TextField>
                    <TextField sx={{ mt: 1 }} size="medium" label="Select Shifting" select value={shifting} onChange={(e) => { setShifting(e.target.value) }} SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        <option value="1">Shift 1</option>
                        <option value="2">Shift 2</option>
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

HeaderModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default HeaderModal;
