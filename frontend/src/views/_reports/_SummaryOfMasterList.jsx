import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { OPEN_SUMMARYDOCTYPE } from '../../store/actions';
import { useState } from 'react';
import { linkToBackend } from '../../store/constant';
import http from "../../api/http";
import { toast } from "sonner";
import LoadSaving from "../../components/LoadSaving/Loading.jsx";
import { useAuth } from '../../modules/context/AuthContext';

const SummaryByMasterlist = ({ maxWidth, onClick }) => {
    const theme = useTheme();
    const open = useSelector((state) => state.customization.openSummaryDocType);
    const dispatch = useDispatch();
    const CloseDialog = () => { dispatch({ type: OPEN_SUMMARYDOCTYPE, openSummaryDocType: false }) }
    const [loadSaving, setLoadSaving] = useState(false);
    const { accessToken } = useAuth();

    const initialDataVariable = {
        DateFrom: "",
        DateTo: "",
        checkReport: 1,
        Masterlist: 1,
    };

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
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
                window.open(linkToBackend + "/print-summary-by-date-range?dataVariable[Masterlist]=1" +
                    "&dataVariable[DateFrom]=" + dataVariable.DateFrom +
                    "&dataVariable[DateTo]=" + dataVariable.DateTo +
                    "&dataVariable[GeneratedBy]=" + accessToken.Fname +
                    "&dataVariable[checkReport]=0"
                    , "_blank");
                window.open(linkToBackend + "/print-summary-by-date-range?dataVariable[Masterlist]=1" +
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
                    <Typography fontSize={20}>Summary of Archived By Masterlist</Typography>
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

SummaryByMasterlist.propTypes = {
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    onClick: PropTypes.func,
}

export default SummaryByMasterlist