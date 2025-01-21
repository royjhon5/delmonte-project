import { Button, Grid, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import Iframe from "react-iframe";
import SearchViaKeyWord from "./_SearchViaKeyWord";
import { OPEN_SEARCHVIAKEYWORD } from "../../store/actions";
import { useDispatch } from "react-redux";
import LoadSaving from "../../components/LoadSaving/Loading.jsx";
import http from "../../api/http";
import { toast } from "sonner";
import { useAuth } from '../../modules/context/AuthContext';

const InquiryData = () => {
    const dispatch = useDispatch();
    const openSearchViaKeyword = () => { dispatch({ type: OPEN_SEARCHVIAKEYWORD, openSearchViaKeyword: true }); }
    const [loadSaving, setLoadSaving] = useState(false);
    const { accessToken } = useAuth();

    // set variables
    const initialDataVariable = {
        id: "",
        DocTypeLinkID: "",
        document_type: "",
        DocReferenceID: "",
        DVNo: "",
        DVDate: "",
        JEVNo: "",
        ORSNo: "",
        ORSDate: "",
        Payee: "",
        Office: "",
        Particulars: "",
        Amount: "",
        EArchiveNote: "",
        ArchivedBy: "",
        ArchivedByDisplay: "",
        ArchiveDateTime: "",
        pathfile_name: "",
        scannerID: "",
        SubDocName: "",
        SubDocIDLink: "",
        KeyWord: "",
        Subject: "",
        Department: "",
        xAmount: "",
        OfficeTo: "",
        DepartmentTo: "",
        PayrollPeriod: "",
        DocNature: "",
        fileSize: "",
        documentDate: "",
        personnelName: "",
        fileName: "",
        AOMNo: "",
        AOMDate: "",
        DateReceived: "",
        DateSent: "",
        LetterFor: "",
        LetterTo: "",
        category: ""
    }

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    async function modalClose(params) {
        if (params) {
            setLoadSaving("Checking file from NAS...");
            Object.entries(params).forEach(async ([key, value]) => {
                setDataVariable(prevState => ({
                    ...prevState,
                    [key]: value
                }));
            });
            if(accessToken.UserLevel == "Restricted User") {
                toast.error("You are not allowed to view files. Please contact administrator if you have questions.");
                setLoadSaving(false);
            }
            else getPreviewFile(params.pathfile_name);
        }
    }

    const [iframePath, setIframePath] = useState("");
    const [filePath, setFilePath] = useState("");

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    const getPreviewFile = async (pathfile_name) => {
        // clear first
        setIframePath("");
        setFilePath("");
        try {
            const response = await http.get('/preview-file', {
                params: {
                    filePath: pathfile_name,
                }
            });
            if (response.data.success) {
                setDataVariable(prevState => ({
                    ...prevState,
                    fileSize: response.data.filesize,
                    fileName: response.data.filename,
                }));
                setFilePath(response.data.filepath);
                const blobUrl = await URL.createObjectURL(b64toBlob(response.data.base64Data, response.data.mimeType));
                setIframePath(blobUrl);
            }
            else toast.error(response.data.message);
            setLoadSaving(false);
        } catch (error) {
            console.error(error);
            toast.error('Connection failed!');
            setLoadSaving(false);
        }
    };

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchViaKeyWord onCloseModal={modalClose} />
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Grid container spacing={1}>
                            {/* SEARCH BUTTON */}
                            <Grid item xs={12} md={12}>
                                <Button startIcon={<SearchIcon />} variant="contained" fullWidth onClick={openSearchViaKeyword} >Search Via Keyword</Button>
                            </Grid>

                            {/* DOCUMENT TPYE? */}
                            {dataVariable.DocTypeLinkID == 5 ?
                                <>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Subject" value={dataVariable.Subject} name="Subject" inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Date Received" value={dataVariable.DateReceived} name="DateReceived" inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" multiline rows={4} fullWidth size="small" label="For" value={dataVariable.LetterFor} name="LetterFor" inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" multiline rows={4} fullWidth size="small" label="To" value={dataVariable.LetterTo} name="LetterTo" inputProps={{ readOnly: true }} />
                                    </Grid>
                                </> :
                                <>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Document Type" value={dataVariable.document_type} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Reference ID" value={dataVariable.DocReferenceID} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {dataVariable.DocTypeLinkID == 4 ?
                                        <>
                                            <Grid item xs={12} md={12}>
                                                <TextField variant="filled" fullWidth size="small" label="Document Category" value={dataVariable.category} inputProps={{ readOnly: true }} />
                                            </Grid>
                                        </> : ""
                                    }

                                    {/* DV */}
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="DV No" value={dataVariable.DVNo} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="DV Date" value={dataVariable.DVDate} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {/* JEV */}
                                    <Grid item xs={12} md={12}>
                                        <TextField variant="filled" fullWidth size="small" label="JEV No" value={dataVariable.JEVNo} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {/* ORS */}
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="ORS No" value={dataVariable.ORSNo} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Particulars" value={dataVariable.Particulars} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {/* PAYEE */}
                                    <Grid item xs={12} md={12}>
                                        <TextField variant="filled" fullWidth size="small" label="Payee" value={dataVariable.Payee} inputProps={{ readOnly: true }} />
                                    </Grid>


                                    {/* OFFICE */}
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Office" value={dataVariable.Office} inputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField variant="filled" fullWidth size="small" label="Department" value={dataVariable.Department} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {/* AMOUNT */}
                                    <Grid item xs={12} md={12}>
                                        <TextField variant="filled" fullWidth size="small" label="Amount" value={dataVariable.xAmount} inputProps={{ readOnly: true }} />
                                    </Grid>

                                    {dataVariable.DocTypeLinkID == 4 ?
                                        <>
                                            <Grid item xs={12} md={6}>
                                                {dataVariable.category == 'Outgoing' ?
                                                    <TextField variant="filled" fullWidth size="small" label="Date Sent" value={dataVariable.DateSent} inputProps={{ readOnly: true }} /> :
                                                    <TextField variant="filled" fullWidth size="small" label="Date Received" value={dataVariable.DateReceived} inputProps={{ readOnly: true }} />
                                                }
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField variant="filled" fullWidth size="small" label="Address To" value={dataVariable.personnelName} inputProps={{ readOnly: true }} />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <TextField variant="filled" fullWidth size="small" label="Subject" value={dataVariable.Subject} inputProps={{ readOnly: true }} />
                                            </Grid>
                                        </> : ""
                                    }
                                </>
                            }

                            {/* NOTES */}
                            <Grid item xs={12} md={12}>
                                <TextField variant="filled" fullWidth size="small" label="eRAS Notes" value={dataVariable.EArchiveNote} inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField variant="filled" fullWidth size="small" label="Keyword" value={dataVariable.KeyWord} inputProps={{ readOnly: true }} multiline rows={4} />
                            </Grid>

                            {/* ARCHIVED */}
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="Archived By" value={dataVariable.ArchivedByDisplay} inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="Archived Date/Time" value={dataVariable.ArchiveDateTime} inputProps={{ readOnly: true }} />
                            </Grid>


                            {/* FILE SIZE */}
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="File Name" value={dataVariable.fileName} inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="File Size" value={dataVariable.fileSize} inputProps={{ readOnly: true }} />
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Iframe width="100%" height="714px" src={iframePath} alt='not found' ></Iframe>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default InquiryData