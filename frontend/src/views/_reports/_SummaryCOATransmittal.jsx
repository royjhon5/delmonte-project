import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, useTheme, MenuItem, Select, OutlinedInput, InputLabel, Checkbox, ListItemText, FormControl } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { OPEN_COATRANSMITTALREPORT } from '../../store/actions.js';
import { hookContainer } from '../../hooks/globalQuery.jsx';
import { useState } from 'react';
import { linkToBackend } from '../../store/constant.js';
import http from "../../api/http.jsx";
import { toast } from "sonner";
import LoadSaving from "../../components/LoadSaving/Loading.jsx";
import { useAuth } from '../../modules/context/AuthContext.jsx';

const SummaryByCOATransmittal = ({ maxWidth, onClick }) => {
    const theme = useTheme();
    const open = useSelector((state) => state.customization.openCOATransmittalReport);
    const dispatch = useDispatch();
    const CloseDialog = () => { dispatch({ type: OPEN_COATRANSMITTALREPORT, openCOATransmittalReport: false }) }
    const [loadSaving, setLoadSaving] = useState(false);
    const { data: docList } = hookContainer('get-document-type');
    const { accessToken } = useAuth();

    const initialDataVariable = {
        DocType: [],
        DateFrom: "",
        DateTo: "",
        checkReport: 1,
        COATransmittal: 1
    };

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        if (name == 'DocType') typeof value === 'string' ? value.split(',') : value;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const generateReport = async (event) => {
        event.preventDefault();
        try {
            setLoadSaving("Generating Report...");
            const response = await http.get('/print-summary-by-date-range', {
                params: {
                    dataVariable
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                var url = "";
                dataVariable.DocType.forEach((element, index) => {
                    url += "&dataVariable[DocType][" + index + "]=" + element;
                });
                window.open(linkToBackend + "/print-summary-by-date-range?dataVariable[COATransmittal]=" + dataVariable.COATransmittal +
                    url +
                    "&dataVariable[DateFrom]=" + dataVariable.DateFrom +
                    "&dataVariable[DateTo]=" + dataVariable.DateTo +
                    "&dataVariable[GeneratedBy]=" + accessToken.Fname +
                    "&dataVariable[checkReport]=0"
                    , "_blank");
                window.open(linkToBackend + "/print-summary-by-date-range?dataVariable[COATransmittal]=" + dataVariable.COATransmittal +
                    url +
                    "&dataVariable[DateFrom]=" + dataVariable.DateFrom +
                    "&dataVariable[DateTo]=" + dataVariable.DateTo +
                    "&dataVariable[GeneratedBy]=" + accessToken.Fname +
                    "&dataVariable[excel]=true" +
                    "&dataVariable[checkReport]=0"
                    , "_blank");
            } else toast.error(response.data.message);
            setLoadSaving(false);
        } catch (error) {
            console.error(error);
            toast.error('Connection failed!');
            setLoadSaving(false);
        } finally {
            setLoadSaving(false);
        }
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            <Dialog
                maxWidth={maxWidth}
                fullWidth={true}
                onClose={CloseDialog}
                open={open}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(22, 28, 36, 0.8)',
                    }
                }}
                sx={{
                    overflowY: 'auto',
                    boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px'
                }}>
                <DialogTitle>
                    <Typography fontSize={20}>COA Transmittal Report</Typography>
                </DialogTitle>
                <form onSubmit={generateReport}>
                    <DialogContent
                        sx={{
                            flex: '1 1 auto',
                            overflowY: 'auto',
                            padding: '0px 24px'
                        }}
                    >
                        {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
                        <Grid container spacing={2} sx={{ mt: .5 }}>
                            <Grid item xs={12} md={12}>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="demo-multiple-name-label">Document Type</InputLabel>
                                    <Select variant="outlined" size="medium" id="demo-multiple-checkbox" labelId="demo-multiple-name-label" input={<OutlinedInput label="Document Type" />} renderValue={(selected) => selected.join(', ')} multiple name="DocType" value={dataVariable.DocType} onChange={updateDataVariable} MenuProps={MenuProps} fullWidth required>
                                        {/* <MenuItem value=""></MenuItem> */}
                                        {docList?.map((option) => (
                                            (option.DTName == 'Financial Documents' || option.DTName == 'Payroll and Payslips' || option.DTName == 'AOM Documents') ?
                                                (<MenuItem key={option.id} value={`${option.DTName}`}>
                                                    <Checkbox checked={dataVariable.DocType.includes(`${option.DTName}`)} />
                                                    <ListItemText primary={option.DTName} />
                                                </MenuItem>) : ""
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" type="date" fullWidth size="small" label="Date From" value={dataVariable.DateFrom} onChange={updateDataVariable} name="DateFrom" InputLabelProps={{ shrink: true }} required />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" type="date" fullWidth size="small" label="Date From" value={dataVariable.DateTo} onChange={updateDataVariable} name="DateTo" InputLabelProps={{ shrink: true }} required />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            flex: '1 1 auto',
                            overflowY: 'auto',
                            padding: '15px 24px'
                        }}
                    >
                        <Button variant="contained" color="primary" type='submit' fullWidth>Generate</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

SummaryByCOATransmittal.propTypes = {
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    onClick: PropTypes.func,
}

export default SummaryByCOATransmittal