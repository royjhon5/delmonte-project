import { Box, Button, Grid, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_HEADER_FORM, OPEN_CUSTOM_HEADER_MODAL, SEARCH_SELECTED_DATA } from "../../../../store/actions.js";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http.jsx";
import { useEffect, useState } from "react";
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

    const [client_name, setClientName] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');

    const SaveOrUpdateData = async () => {
        if (!client_name) return toast.error('Client is required.');
        if (!location) return toast.error('Location is required.');
        if (!department) return toast.error('Department is required.');
        var formVariable = {
            id: isToUpdate ? toUpdateData.id : 0,
            client_name: client_name,
            location: location,
            department: department,
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
            const response = await http.post('/post-accounttochargehdr', formVariable);
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
            setClientName(toUpdateData.client_name);
            setLocation(toUpdateData.location);
            setDepartment(toUpdateData.department);
        }
    }, [isToUpdate, toUpdateData])

    const clearData = () => {
        setClientName('');
        setLocation('');
        setDepartment('');
    }

    // modals
    const [openModalTemplateLocation, setOpenModalTemplateLocation] = useState(false);
    async function modalCloseLocation(params) {
        setOpenModalTemplateLocation(false);
        if (params) {
            setLocation(params.location_name);
        }
    }

    const [openModalTemplateDepartment, setOpenModalTemplateDepartment] = useState(false);
    async function modalCloseDepartment(params) {
        setOpenModalTemplateDepartment(false);
        if (params) {
            setDepartment(params.department_name);
        }
    }

    const [openModalTemplateClient, setOpenModalTemplateClient] = useState(false);
    async function modalCloseClient(params) {
        setOpenModalTemplateClient(false);
        if (params) {
            setClientName(params.client_name);
        }
    }

    return (
        <>
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
                DialogTitles={isToUpdate ? "Update Account To Charge Header" : "Add New Account To Charge Header"}
                onClose={CloseDialog}
                DialogContents={
                    <Box sx={{ mt: 1 }}>
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
