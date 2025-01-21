import { Box, Dialog, DialogContent, Grid, IconButton, TextField, Typography, useTheme, Button } from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_SEARCHVIAKEYWORD } from "../../store/actions";
import CloseIcon from '@mui/icons-material/Close';
import CustomDataGrid from "../../components/CustomDataGrid";
import NoData from "../../components/CustomDataTable/NoData";
import { hookContainer } from "../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";
import LoadSaving from "../../components/LoadSaving/Loading.jsx";
import http from "../../api/http";
import { toast } from "sonner";
import { useAuth } from '../../modules/context/AuthContext';

const SearchViaKeyWord = (props) => {
    const { onCloseModal } = props;
    const theme = useTheme();
    const open = useSelector((state) => state.customization.openSearchViaKeyword);
    const dispatch = useDispatch();
    const CloseDialog = (params) => { setDataVariable(initialDataVariable); setTableData([]); dispatch({ type: OPEN_SEARCHVIAKEYWORD, openSearchViaKeyword: false }); onCloseModal(params.row) }
    const queryClient = useQueryClient();
    const [loadSaving, setLoadSaving] = useState(false);
    const { accessToken } = useAuth();

    useEffect(() => {
        queryClient.invalidateQueries(['get-sub-document-type']);
    })

    const initialDataVariable = {
        DocTypeLinkID: "",
        SubDocIDLink: "",
        DVNo: "",
        DVDateFrom: "",
        DVDateTo: "",
        JEVNo: "",
        UploadDateFrom: "",
        UploadDateTo: "",
        Payee: "",
        Particulars: "",
        Office: "",
        Department: "",
        KeyWord: "",
        isCOAUser: accessToken.UserLevel == 'COA User' ? 1 : 0
    }

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const { data: docList } = hookContainer('get-document-type');
    const { data: subDocList } = hookContainer('get-sub-document-type', { DocType_IDLink: dataVariable.DocTypeLinkID ? dataVariable.DocTypeLinkID : 0 });
    const { data: departmentList } = hookContainer('get-department');

    const [tableData, setTableData] = useState([]);
    const constMappedData = Array.isArray(tableData) ? tableData.map((row) => {
        return { ...row, id: row.id };
    }) : [];

    const getInquirySearchFilter = async (event) => {
        setTableData([]);
        event.preventDefault();
        try {
            setLoadSaving("Searching...");
            const response = await http.get('/get-inquiry-search-filter', {
                params: {
                    dataVariable,
                }
            });
            if (!response.data.message) setTableData(response.data);
            else toast.error(response.data.message);
            await http.post('/add-audit-log', {
                audit_by: accessToken.userID,
                action: "Inquiry Search",
                audit_data: JSON.stringify(dataVariable),
                interface: "Inquiry"
            }); // save audit log
            setLoadSaving(false);
        } catch (error) {
            console.error(error);
            toast.error('Connection failed!');
        } finally {
            setLoadSaving(false);
        }
    };

    const ColumnHeader = [
        { field: 'document_type', headerName: 'Document Type', flex: 1 },
        { field: 'SubDocName', headerName: 'Sub Document Type', flex: 1 },
        { field: 'DVNo', headerName: 'DV No', flex: 1 },
        { field: 'Payee', headerName: 'Payee', flex: 1 },
        { field: 'Department', headerName: 'Department', flex: 1 },
        { field: 'Particulars', headerName: 'Particulars', flex: 1 },
        { field: 'xAmount', headerName: 'Amount', flex: 1, align: "center" },
        { field: 'ArchivedByDisplay', headerName: 'Archived By', flex: 1 }
    ];
    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <Dialog
                maxWidth="xxl"
                fullWidth={true}
                // onClose={CloseDialog}
                open={open}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(22, 28, 36, 0.8)',
                    }
                }}
                sx={{
                    overflowY: 'auto',
                    boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px'
                }}
            >
                <DialogContent sx={{ padding: 0 }}>
                    <Grid container sx={{ mb: 1, padding: 2 }} spacing={1}>
                        <Grid item xs={12} md={10} >
                            <Typography>Search Document Filter By Keyword</Typography>
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <IconButton size="small" color="error" onClick={CloseDialog}><CloseIcon fontSize="small" /></IconButton>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container sx={{ mb: 1, padding: 2 }} spacing={1}>
                                <Grid item xs={12} md={8}>
                                    <TextField variant="filled" size="small" label="Document Type" select value={dataVariable.DocTypeLinkID} onChange={updateDataVariable} name="DocTypeLinkID" SelectProps={{ native: true, }} fullWidth>
                                        <option value=""></option>
                                        {docList?.map((option) => (
                                            (accessToken.UserLevel == "COA User" && ['Accounting Office Documents', 'Miscellaneous/Others', 'AOM Documents'].includes(option.DTName)) ? "" :
                                            <option key={option.id} value={`${option.id}`}>
                                                {option.DTName}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField variant="filled" size="small" label="Sub Document Type" select value={dataVariable.SubDocIDLink} onChange={updateDataVariable} name="SubDocIDLink" SelectProps={{ native: true, }} fullWidth>
                                        <option></option>
                                        {subDocList?.map((option) => (
                                            <option key={option.id} value={`${option.id}`}>
                                                {option.subDocument_name}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                {/* DV No */}
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" fullWidth size="small" label="DV No" value={dataVariable.DVNo} onChange={updateDataVariable} name="DVNo" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField variant="filled" type="date" fullWidth size="small" label="DV Date From" value={dataVariable.DVDateFrom} onChange={updateDataVariable} name="DVDateFrom" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField variant="filled" type="date" fullWidth size="small" label="DV Date To" value={dataVariable.DVDateTo} onChange={updateDataVariable} name="DVDateTo" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                {/* JV No */}
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" fullWidth size="small" label="JEV No" value={dataVariable.JEVNo} onChange={updateDataVariable} name="JEVNo" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField variant="filled" type="date" fullWidth size="small" label="Upload Date From" value={dataVariable.UploadDateFrom} onChange={updateDataVariable} name="UploadDateFrom" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField variant="filled" type="date" fullWidth size="small" label="Upload Date To" value={dataVariable.UploadDateTo} onChange={updateDataVariable} name="UploadDateTo" InputLabelProps={{ shrink: true }} />
                                </Grid>
                                {/* PAYEE */}
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" fullWidth size="small" label="Payee" value={dataVariable.Payee} onChange={updateDataVariable} name="Payee" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" fullWidth size="small" label="Particulars" value={dataVariable.Particulars} onChange={updateDataVariable} name="Particulars" />
                                </Grid>
                                {/* OFFICE */}
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" fullWidth size="small" label="Office" value={dataVariable.Office} onChange={updateDataVariable} name="Office" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant="filled" size="small" label="Department" select value={dataVariable.Department} onChange={updateDataVariable} name="Department" SelectProps={{ native: true, }} fullWidth>
                                        <option></option>
                                        {departmentList?.map((option) => (
                                            <option key={option.id} value={`${option.department_name}`}>
                                                {option.department_name}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Grid container sx={{ mb: 1, padding: 2 }} spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <TextField variant="filled" multiline rows={8.5} fullWidth size="small" label="Keyword" value={dataVariable.KeyWord} onChange={updateDataVariable} name="KeyWord" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button variant="contained" size="large" fullWidth onClick={getInquirySearchFilter}>Search with Filter</Button>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button variant="contained" size="large" color="secondary" fullWidth onClick={() => { setDataVariable(initialDataVariable); setTableData([]); }}>Clear Filter</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CustomDataGrid
                                columns={ColumnHeader}
                                rows={constMappedData}
                                maxHeight={450}
                                height={450}
                                slots={{ noRowsOverlay: NoData }}
                                onRowClick={(params) => {
                                    CloseDialog(params)
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default SearchViaKeyWord