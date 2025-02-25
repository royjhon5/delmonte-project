import { Box, Button, Grid, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_HEADER_FORM, OPEN_CUSTOM_HEADER_MODAL, SEARCH_SELECTED_DATA } from "../../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";
import SearchGroupModal from "../../../../components/SearchMasterfile/SearchGroup.jsx";
import SearchLocationModal from "../../../../components/SearchMasterfile/SearchLocation.jsx";
import SearchDepartmentModal from "../../../../components/SearchMasterfile/SearchDepartment.jsx";
import SearchClientModal from "../../../../components/SearchMasterfile/SearchClient.jsx";
import SearchIcon from '@mui/icons-material/Search';

const HeaderModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
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

    const [location_idlink, setLocationLinkID] = useState('');
    const [department_idlink, setDepartmentLinkID] = useState('');
    const [group_idlink, setGroupLinkID] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [emp_group, setGroup] = useState('');
    const [client_id, setClientID] = useState('');
    const [client_name, setClientName] = useState('');

    const SaveOrUpdateData = async () => {
        if (!emp_group) return toast.error('Group is required.');
        if (!client_name) return toast.error('Client is required.');
        if (!location) return toast.error('Location is required.');
        if (!department) return toast.error('Department is required.');
        var formVariable = {
            id: isToUpdate ? toUpdateData.id : 0,
            location_idlink: location_idlink,
            department_idlink: department_idlink,
            group_idlink: group_idlink,
            location: location,
            department: department,
            emp_group: emp_group,
            client_id: client_id,
            client_name: client_name,
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
            if (response.data.success) {
                if (response.data.id) formVariable.id = response.data.id;
                toast.success('Data saved successfully.');
                dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: formVariable });
                clearData();
                RefreshData();
                CloseDialog();
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error)
        }
    });

    useEffect(() => {
        if (isToUpdate) {
            setLocationLinkID(toUpdateData.location_idlink);
            setDepartmentLinkID(toUpdateData.department_idlink);
            setGroupLinkID(toUpdateData.group_idlink);
            setLocation(toUpdateData.location);
            setDepartment(toUpdateData.department);
            setGroup(toUpdateData.emp_group);
            setClientID(toUpdateData.client_id);
            setClientName(toUpdateData.client_name);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setLocationLinkID('');
        setDepartmentLinkID('');
        setGroupLinkID('');
        setLocation('');
        setDepartment('');
        setGroup('');
        setClientID('');
        setClientName('');
    }

    // modals
    const [openModalTemplateGroup, setOpenModalTemplateGroup] = useState(false);
    async function modalCloseGroup(params) {
        setOpenModalTemplateGroup(false);
        if (params) {
            setGroupLinkID(params.id);
            setGroup(params.groupline_name);
        }
    }

    const [openModalTemplateLocation, setOpenModalTemplateLocation] = useState(false);
    async function modalCloseLocation(params) {
        setOpenModalTemplateLocation(false);
        if (params) {
            setLocationLinkID(params.id);
            setLocation(params.location_name);
        }
    }

    const [openModalTemplateDepartment, setOpenModalTemplateDepartment] = useState(false);
    async function modalCloseDepartment(params) {
        setOpenModalTemplateDepartment(false);
        if (params) {
            setDepartmentLinkID(params.id);
            setDepartment(params.department_name);
        }
    }

    const [openModalTemplateClient, setOpenModalTemplateClient] = useState(false);
    async function modalCloseClient(params) {
        setOpenModalTemplateClient(false);
        if (params) {
            setClientID(params.id);
            setClientName(params.client_name);
        }
    }

    return (
        <>
            <SearchGroupModal
                openModal={openModalTemplateGroup}
                onCloseModal={modalCloseGroup}
            />
            <SearchLocationModal
                openModal={openModalTemplateLocation}
                onCloseModal={modalCloseLocation}
            />
            <SearchDepartmentModal
                openModal={openModalTemplateDepartment}
                onCloseModal={modalCloseDepartment}
            />
            <SearchClientModal
                openModal={openModalTemplateClient}
                onCloseModal={modalCloseClient}
            />
            <CustomDialog
                open={open}
                maxWidth={'xs'}
                DialogTitles={isToUpdate ? "Update Template Header" : "Add New Template Header"}
                onClose={CloseDialog}
                DialogContents={
                    <Box sx={{ mt: 1 }}>
                        <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Select Group</InputLabel>
                            <OutlinedInput size="medium"
                                inputProps={{ readOnly: true }}
                                label="Select Group"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateGroup(true) }}><SearchIcon fontSize="small" /></Button>
                                    </InputAdornment>
                                }
                                value={emp_group} name="emp_group"
                            />
                        </FormControl>
                        <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Select Client</InputLabel>
                            <OutlinedInput size="medium"
                                inputProps={{ readOnly: true }}
                                label="Select Client"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateClient(true) }}><SearchIcon fontSize="small" /></Button>
                                    </InputAdornment>
                                }
                                value={client_name} name="client_name"
                            />
                        </FormControl>
                        <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Select Location</InputLabel>
                            <OutlinedInput size="medium"
                                inputProps={{ readOnly: true }}
                                label="Select Location"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateLocation(true) }}><SearchIcon fontSize="small" /></Button>
                                    </InputAdornment>
                                }
                                value={location} name="location"
                            />
                        </FormControl>
                        <FormControl variant="outlined" fullWidt fullWidth sx={{ mt: 1 }} h>
                            <InputLabel>Select Department</InputLabel>
                            <OutlinedInput size="medium"
                                inputProps={{ readOnly: true }}
                                label="Select Department"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button size="large" variant="contained" onClick={() => { setOpenModalTemplateDepartment(true) }}><SearchIcon fontSize="small" /></Button>
                                    </InputAdornment>
                                }
                                value={department} name="department"
                            />
                        </FormControl>
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
        </>
    );
}

HeaderModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default HeaderModal;
