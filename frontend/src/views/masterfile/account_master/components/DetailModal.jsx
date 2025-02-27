import { Autocomplete, Box, Button, Grid, Popper, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, Divider } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useEffect, useState } from "react";
import SearchActivityModal from "../../../../components/SearchMasterfile/SearchActivity.jsx";
import SearchGLCodeModal from "../../../../components/SearchMasterfile/SearchGLCode.jsx";
import SearchCostCenterModal from "../../../../components/SearchMasterfile/SearchCostCenter.jsx";
import SearchIcon from '@mui/icons-material/Search';

const DetailModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomModal);
    const headerData = useSelector((state) => state.customization.searchSelectedData);
    //boolean
    const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
    const toUpdateData = useSelector((state) => state.customization.formData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
        dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
        clearData();
    }
    const initialDataVariable = {
        id: "",
        header_id: "",
        activity: "",
        gl_code: "",
        costcenter: "",
        r_st: "",
        r_ot: "",
        r_nd: "",
        r_ndot: "",
        rh_st: "",
        rh_ot: "",
        rh_nd: "",
        rh_ndot: "",
        sh_st: "",
        sh_ot: "",
        sh_nd: "",
        sh_ndot: "",
        rd_st: "",
        rd_ot: "",
        rd_nd: "",
        rd_ndot: "",
        rdrh_st: "",
        rdrh_ot: "",
        rdrh_nd: "",
        rdrh_ndot: "",
        rdsh_st: "",
        rdsh_ot: "",
        rdsh_nd: "",
        rdsh_ndot: "",
        labor_type: "",
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
        // if(name == 'r_st') {
        //     setDataVariable(prevState => ({
        //         ...prevState,
        //         r_ot: value * 1.25,
        //         r_nd: value * 1.25,
        //         r_ndot: value * 1.25
        //     }));
        // }
    };
    const SaveOrUpdateData = async () => {
        for (var key of Object.keys(dataVariable)) {
            if(dataVariable[key] == "" && key != 'id' && key != 'header_id') return toast.error('All fields are required.');
        }
        let AccountMasterData = dataVariable;
        AccountMasterData.header_id = headerData.id;
        const response = await http.post('/post-accounttocharge', { AccountMasterData });
        if (response.data.success) {
            clearData();
            RefreshData();
            toast.success('Data saved successfully.');
            CloseDialog();
        } else toast.error(response.data.message);
    };

    const clearData = () => {
        setDataVariable(initialDataVariable);
    }

    // modals
    const [openModalSearchActivity, setOpenModalSearchActivity] = useState(false);
    async function modalCloseSearchActivity(params) {
        setOpenModalSearchActivity(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                activity: params.activityname,
                costcenter: params.costcenter,
                gl_code: params.gl_code
            }));
        }
    }

    const [openModalSearchGLCode, setOpenModalSearchGLCode] = useState(false);
    async function modalCloseSearchGLCode(params) {
        setOpenModalSearchGLCode(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                gl_code: params.gl_code
            }));
        }
    }

    const [openModalSearchCostCenter, setOpenModalSearchCostCenter] = useState(false);
    async function modalCloseSearchCostCenter(params) {
        setOpenModalSearchCostCenter(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                costcenter: params.costcenter,
            }));
        }
    }

    // use effect
    useEffect(() => {
        if (isToUpdate) {
            setDataVariable(toUpdateData);
        }
    }, [isToUpdate, toUpdateData])

    return (
        <>
            <SearchActivityModal
                openModal={openModalSearchActivity}
                onCloseModal={modalCloseSearchActivity}
            />
            <SearchGLCodeModal
                openModal={openModalSearchGLCode}
                onCloseModal={modalCloseSearchGLCode}
            />
            <SearchCostCenterModal
                openModal={openModalSearchCostCenter}
                onCloseModal={modalCloseSearchCostCenter}
            />
            <CustomDialog
                open={open}
                maxWidth={'xl'}
                DialogTitles={isToUpdate ? "Update Account To Charge Rate" : "Add New Account To Charge Rate"}
                onClose={CloseDialog}
                DialogContents={
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select Activity</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Activity"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchActivity(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.activity} onChange={updateDataVariable} name="activity"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select GL Code</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select GL Code"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchGLCode(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.gl_code} onChange={updateDataVariable} name="gl_code"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="outlined" fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Select Cost Center</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Select Cost Center"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalSearchCostCenter(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.costcenter} onChange={updateDataVariable} name="costcenter"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField sx={{ mt: 1}} fullWidth size="medium" label="Select Labor Type" select value={dataVariable.labor_type} onChange={updateDataVariable} name="labor_type" SelectProps={{ native: true, }}>
                                    <option></option>
                                    <option value="Direct Labor">Direct Labor</option>
                                    <option value="Indirect Labor">Indirect Labor</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>REGULAR DAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.r_st} onChange={updateDataVariable} name="r_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.r_ot} onChange={updateDataVariable} name="r_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.r_nd} onChange={updateDataVariable} name="r_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.r_ndot} onChange={updateDataVariable} name="r_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>SPECIAL HOLIDAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.sh_st} onChange={updateDataVariable} name="sh_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.sh_ot} onChange={updateDataVariable} name="sh_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.sh_nd} onChange={updateDataVariable} name="sh_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.sh_ndot} onChange={updateDataVariable} name="sh_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>REGULAR HOLIDAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.rh_st} onChange={updateDataVariable} name="rh_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.rh_ot} onChange={updateDataVariable} name="rh_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.rh_nd} onChange={updateDataVariable} name="rh_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.rh_ndot} onChange={updateDataVariable} name="rh_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>REST DAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.rd_st} onChange={updateDataVariable} name="rd_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.rd_ot} onChange={updateDataVariable} name="rd_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.rd_nd} onChange={updateDataVariable} name="rd_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.rd_ndot} onChange={updateDataVariable} name="rd_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>REST DAY SPECIAL HOLIDAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.rdsh_st} onChange={updateDataVariable} name="rdsh_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.rdsh_ot} onChange={updateDataVariable} name="rdsh_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.rdsh_nd} onChange={updateDataVariable} name="rdsh_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.rdsh_ndot} onChange={updateDataVariable} name="rdsh_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Divider>REST DAY REGULAR HOLIDAYS</Divider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.rdrh_st} onChange={updateDataVariable} name="rdrh_st" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.rdrh_ot} onChange={updateDataVariable} name="rdrh_ot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP" type="number" step="0.01" value={dataVariable.rdrh_nd} onChange={updateDataVariable} name="rdrh_nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField label="NP-OT" type="number" step="0.01" value={dataVariable.rdrh_ndot} onChange={updateDataVariable} name="rdrh_ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
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

DetailModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default DetailModal;
