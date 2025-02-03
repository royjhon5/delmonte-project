import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState } from "react";
import SearchEmployeeModal from "./SearchEmployee.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import { hookContainer } from "../../../../hooks/globalQuery.jsx";

const AddDARDetail = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
        setDataVariable(initialDataVariable);
    }
    const [loadSaving, setLoadSaving] = useState(false);

    const { data: accounttochargeList } = hookContainer('/get-accounttocharge');
    const initialDataVariable = {
        id: "",
        dar_idlink: "",
        ChapaID: "",
        emp_lname: "",
        emp_fname: "",
        emp_mname: "",
        emp_ext_name: "",
        time_in: "",
        time_out: "",
        st: "",
        ot: "",
        nd: "",
        ndot: "",
        gl: "",
        cost_center: "",
        activitylink_id: "",
        activity: "",
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name == 'activitylink_id') {
            const selectedRow = filterIt(accounttochargeList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                activity: selectedRow[0].activityname,
                cost_center: selectedRow[0].costcenter,
                gl: selectedRow[0].gl_code
            }));
        }
    };

    function filterIt(arr, searchKey, keyValue = false) {
        return arr.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                if (obj[(keyValue ? keyValue : key)].toString().includes(searchKey)) return obj;
            })
        });
    }

    const clearData = async () => {
        setDataVariable(initialDataVariable);
    }

    const SaveOrUpdateData = async () => {
        setLoadSaving("Saving...");
        const response = await http.post('/post-dardetail', { dataVariable });
        if (response.data.success) {
            if (response.data.id) {
                setDataVariable(prevState => ({
                    ...prevState,
                    id: response.data.id
                }));
            }
            toast.success(response.data.message);
            onCloseModal(dataVariable); // close modal after saving
            setDataVariable(initialDataVariable); // set initial variables | clear fields
        } else toast.error(response.data.message);
        setLoadSaving(false);
    }

    // modal
    const [openModalEmployee, setOpenModalEmployee] = useState(false);
    async function modalClose(params) {
        setOpenModalEmployee(false);
        if (params) {
            setDataVariable(prevState => ({
                ...prevState,
                ChapaID: params.chapa_id,
                emp_lname: params.lastname,
                emp_fname: params.firstname,
                emp_mname: params.middlename,
                emp_ext_name: params.extname,
            }));
        }
    }

    // useEffects
    useEffect(() => {
        if (passedData.id) setDataVariable(passedData);
        else if (passedData.ChapaID) setDataVariable(passedData);
        else if (passedData.dar_idlink) {
            setDataVariable(prevState => ({
                ...prevState,
                dar_idlink: passedData.dar_idlink
            }));
        }
    }, [passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchEmployeeModal
                openModal={openModalEmployee}
                onCloseModal={modalClose}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={passedData.id ? "Update DAR Detail" : "Add New DAR Detail"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel>Select Employee (Chapa ID)</InputLabel>
                                    <OutlinedInput size="medium"
                                        inputProps={{ readOnly: true }}
                                        label="Voucher Number"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button size="large" variant="contained" onClick={() => { setOpenModalEmployee(true) }}><SearchIcon fontSize="small" /></Button>
                                            </InputAdornment>
                                        }
                                        value={dataVariable.ChapaID} onChange={updateDataVariable} name="ChapaID"
                                    />
                                </FormControl>
                                <TextField label="Lastname" value={dataVariable.emp_lname} onChange={updateDataVariable} name="emp_lname" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Activity" select value={dataVariable.activitylink_id} onChange={updateDataVariable} name="activitylink_id" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {accounttochargeList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.activityname + " | " + option.gl_code + " | " + option.costcenter}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Firstname" value={dataVariable.emp_fname} onChange={updateDataVariable} name="emp_fname" fullWidth size="medium" inputProps={{ readOnly: true }} />
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={8}>
                                        <TextField label="Middlename" value={dataVariable.emp_mname} onChange={updateDataVariable} name="emp_mname" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Extname" value={dataVariable.emp_ext_name} onChange={updateDataVariable} name="emp_ext_name" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ readOnly: true }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Time In" value={dataVariable.time_in} onChange={updateDataVariable} name="time_in" fullWidth sx={{ mt: 1 }} size="medium" inputProps={{ maxLength: 4 }} placeholder="e.g. 2300" />
                                <TextField label="ST" type="number" step="0.01" value={dataVariable.st} onChange={updateDataVariable} name="st" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="ND" type="number" step="0.01" value={dataVariable.nd} onChange={updateDataVariable} name="nd" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Time Out" value={dataVariable.time_out} onChange={updateDataVariable} name="time_out" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="OT" type="number" step="0.01" value={dataVariable.ot} onChange={updateDataVariable} name="ot" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="NDOT" type="number" step="0.01" value={dataVariable.ndot} onChange={updateDataVariable} name="ndot" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                        </Grid>
                    </>
                }
                DialogAction={
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            {passedData.id ?
                                <Button variant="contained" color="success" fullWidth onClick={SaveOrUpdateData}>Update Data</Button>
                                :
                                <Button variant="contained" color="success" fullWidth onClick={SaveOrUpdateData}>Save Data</Button>}
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" fullWidth onClick={() => { closeCurrentModal() }}>Cancel</Button>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default AddDARDetail;
