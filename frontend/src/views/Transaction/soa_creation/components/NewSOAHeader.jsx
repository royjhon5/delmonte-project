import { Button, Grid, TextField, FormControl, InputLabel, InputAdornment, OutlinedInput, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { toast } from "sonner";
import http from "../../../../api/http.jsx";
import { useEffect, useState } from "react";
import SearchTemplateModal from "./SearchTemplate.jsx";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import { hookContainer } from "../../../../hooks/globalQuery.jsx";
import dayjs from 'dayjs';

const NewSOAHeaderModal = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
        setDataVariable(initialDataVariable);
    }
    const [loadSaving, setLoadSaving] = useState(false);

    const { data: departmentList } = hookContainer('/get-department');
    const { data: locationList } = hookContainer('/get-location');
    const { data: dayTypeList } = hookContainer('/get-daytype');

    const initialDataVariable = {
        id: "",
        dept_idlink: "",
        location_idlink: "",
        daytype_idlink: "",
        soa_no: "",
        xDate: dayjs().format('YYYY-MM-DD'),
        soa_status: "ACTIVE",
        prepared_by: "",
        preparedby_position: "",
        checked_by: "",
        checkedby_position: "",
        confirmed_by: "",
        confirmedby_position: "",
        approved_by: "",
        approvedby_position: "",
        period_coverage: "",
        // 
        department: "",
        location: "",
        daytype: "",
    };
    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
        if(name == 'dept_idlink') {
            const selectedRow = filterIt(departmentList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                department: selectedRow[0].department_name
            }));
        }
        if(name == 'location_idlink') {
            const selectedRow = filterIt(locationList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                location: selectedRow[0].location_name
            }));
        }
        if(name == 'daytype_idlink') {
            const selectedRow = filterIt(dayTypeList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                daytype: selectedRow[0].dt_name
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
        const response = await http.post('/post-soaheader', { dataVariable });
        if (response.data.success) {
            var returnData = dataVariable;
            if (response.data.id) {
                returnData.id = response.data.id;
                returnData.soa_no = dayjs().format('YYYY-MM-') + response.data.id;
            }
            toast.success(response.data.message);
            onCloseModal(returnData); // close modal after saving
            setDataVariable(initialDataVariable); // set initial variables | clear fields
        } else toast.error(response.data.message);
        setLoadSaving(false);
    }

    // modal

    // useEffects
    useEffect(() => {
        if (passedData.id) setDataVariable(passedData);
    }, [passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={passedData.id ? "Update SOA Header" : "Add New SOA Header"}
                onClose={() => { closeCurrentModal() }}
                DialogContents={
                    <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField size="medium" label="Select Department" select value={dataVariable.dept_idlink} onChange={updateDataVariable} name="dept_idlink" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {departmentList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.department_name}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Location" select value={dataVariable.location_idlink} onChange={updateDataVariable} name="location_idlink" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {locationList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.location_name}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField sx={{ mt: 1 }} size="medium" label="Select Day Type" select value={dataVariable.daytype_idlink} onChange={updateDataVariable} name="daytype_idlink" SelectProps={{ native: true, }} fullWidth>
                                    <option></option>
                                    {dayTypeList?.map((option) => (
                                        <option key={option.id} value={`${option.id}`}>
                                            {option.dt_name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="SOANo" value={dataVariable.soa_no} fullWidth size="medium" inputProps={{ readOnly: true }} />
                                <TextField type="date" value={dataVariable.xDate} onChange={updateDataVariable} name="xDate" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Period Coverage" value={dataVariable.period_coverage} onChange={updateDataVariable} name="period_coverage" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Prepared By" value={dataVariable.prepared_by} onChange={updateDataVariable} name="prepared_by" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Confirmed By" value={dataVariable.confirmed_by} onChange={updateDataVariable} name="confirmed_by" fullWidth sx={{ mt: 1 }} size="medium" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Checked By" value={dataVariable.checked_by} onChange={updateDataVariable} name="checked_by" fullWidth sx={{ mt: 1 }} size="medium" />
                                <TextField label="Approved By" value={dataVariable.approved_by} onChange={updateDataVariable} name="approved_by" fullWidth sx={{ mt: 1 }} size="medium" />
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

export default NewSOAHeaderModal;
