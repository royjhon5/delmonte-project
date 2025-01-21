import { Box, Button, Grid, Paper, TextField, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../api/http.jsx";
import { toast } from "sonner";
import Iframe from "react-iframe";
import { hookContainer } from "../../../hooks/globalQuery.jsx";
import LoadSaving from "../../../components/LoadSaving/Loading.jsx";
import SearchFromEcardingModal from "../_upload_financial_documents/SearchFromEcardingModal.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../../../modules/context/AuthContext.jsx';
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import { PUBLIC_URL } from '../../../store/constant';
import { WebSocket } from "../../../main.jsx";

GlobalWorkerOptions.workerSrc = `${PUBLIC_URL}/pdfjs-worker/pdf.worker.min.js`;
const AOMDocumentsData = () => {
    // const [loadingPrintBtn, setLoadingPrintBtn] = useState(false);
    const documentType = "AOM Documents";
    const [iframePath, setIframePath] = useState("");
    const [scannerPath, setScannerPath] = useState("");
    const [filePath, setFilePath] = useState("");
    const { data: scannerList } = hookContainer('get-scanner-list');
    const [loadSaving, setLoadSaving] = useState(false);
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();
    const [progress, setProgress] = useState(0);
    const socketIO = WebSocket();

    const [scanReady, setScanReady] = useState(false);

    useEffect(() => {
        queryClient.invalidateQueries(['get-sub-document-type']);
    })

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

    const getPreviewScannedDocs = async () => {
        // clear first
        setIframePath("");
        setFilePath("");
        if (!scannerPath) return toast.info("Please select scanner");
        try {
            setLoadSaving("Checking connection to NAS");
            const response = await http.get('/preview-scanned', {
                params: {
                    scannerPath: scannerPath,
                }
            });
            if (response.data.success) {
                setDataVariable(prevState => ({
                    ...prevState,
                    fileSize: response.data.filesize,
                    pathfile_name: response.data.filename,
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

    const scanNewDocument = async () => {
        if (!scannerPath) return toast.info("Please select scanner");
        try {
            setLoadSaving("Checking connection to NAS");
            const response = await http.get('/scan-new-document', {
                params: {
                    scannerPath: scannerPath,
                }
            });
            if (response.data.success) {
                setScanReady(true);
                setIframePath("");
            }
            else toast.error(response.data.message);
            setLoadSaving(false);
        } catch (error) {
            console.error(error);
            toast.error('Connection failed!');
        }
    };

    function getDateNow(type = "date") {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (type == "date") return `${year}-${month}-${day}`;
        if (type == "year") return `${year}`;
        if (type == "day") return `${day}`;
        if (type == "month") return `${month}`;
        if (type == "hour") return `${hour}`;
        if (type == "minute") return `${minute}`;
        if (type == "second") return `${second}`;
        return false;
    }

    // set variables
    const initialDataVariable = {
        id: "",
        DocTypeLinkID: 5, // aom Documents 
        DocReferenceID: "AOM" + getDateNow('year') + getDateNow('month'),
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
        ArchivedBy: accessToken.userID,
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
        AOMNo: "",
        AOMDate: "",
        DateReceived: "",
        DateSent: "",
        LetterFor: "",
        LetterTo: "",
        NeedFollowUp: false,
        DateFollowUp: "",
        IsClosed: "",
        FollowUpRemarks: "",
    }

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value, checked } = e.target;
        console.log(name, value, checked);
        setDataVariable(prevState => ({
            ...prevState,
            [name]: name == 'NeedFollowUp' ? checked : value
        }));
        // if name SubDocIDLink assign SubDocName
        if (name == "SubDocIDLink") {
            const selectedRow = filterIt(subDocList, value, "id");
            setDataVariable(prevState => ({
                ...prevState,
                SubDocName: selectedRow[0].subDocument_name
            }));
        }
        // if name scannerID assign scannerPath
        if (name == "scannerID") {
            const selectedRow = filterIt(scannerList, value, "id");
            setScannerPath(selectedRow[0].dedicatedTempPath);
        }
    };

    // saving data here
    async function saveData(event) {
        event.preventDefault();
        if (!iframePath) return toast.error("No file to upload. Please scan and preview scanned document or attach document to continue.");
        if (dataVariable.NeedFollowUp && !dataVariable.DateFollowUp) return toast.error("Please enter date to followup to continue.");
        try {
            setLoadSaving("Uploading file");
            // move file
            if (filePath) { // if scan
                const fileMoveResponse = await http.post('/move-document', { filePath: filePath });
                if (fileMoveResponse.data.success) {
                    setLoadSaving("Saving data...");
                } else return toast.error(fileMoveResponse.data.message);
            } else { // if upload file
                const formData = new FormData();
                formData.append('filename', dataVariable.pathfile_name);
                formData.append('file', attachFile);
                const fileMoveResponse = await http.post('/upload-document', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (fileMoveResponse.data.success) {
                    setLoadSaving("Saving data");
                } else return toast.error(fileMoveResponse.data.message);
            }
            // save data
            const saveDataResponse = await http.post('/save-archive-header', dataVariable);
            if (saveDataResponse.data.success) {
                await http.post('/add-audit-log', {
                    audit_by: accessToken.userID,
                    action: dataVariable.id > 0 ? "Update" : "Insert",
                    audit_data: JSON.stringify(dataVariable),
                    interface: "Upload AOM Documents"
                }); // save audit log
                if (dataVariable.NeedFollowUp) {
                    await http.post('/add-audit-log', {
                        audit_by: accessToken.userID,
                        action: "Add document needs followup on date " + dataVariable.DateFollowUp,
                        audit_data: "{NeedFollowUp: 1, DateFollowUp: " + dataVariable.DateFollowUp + ", IsClosed: 0, FollowUpRemarks: ''}",
                        interface: "Upload AOM Documents"
                    }); // save audit logs
                }
                await http.post('/add-notification', {
                    user_id: accessToken.userID,
                    archive_hdr_id: dataVariable.id > 0 ? dataVariable.id : saveDataResponse.data.id,
                    action: dataVariable.id > 0 ? "updated AOM document" : "uploaded AOM document",
                }); // save notification
                await http.post('/update-notification-status', {
                    notification_unread: 1,
                }); // update user read unread notification flag
                // add socket here...
                socketIO.emit("triggerNewNotification");
                clearData();
                toast.success(saveDataResponse.data.message);
            } else toast.error(saveDataResponse.data.message);
            setLoadSaving(false);
        } catch (err) {
            console.log(err);
            setLoadSaving(false);
            if (err.response.status === 422) return toast.error(err.response.data.message)
            else toast.error('Saving data failed!')
        } finally {
            setLoadSaving(false);
        }
    }

    function filterIt(arr, searchKey, keyValue = false) {
        return arr.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                if (obj[(keyValue ? keyValue : key)].toString().includes(searchKey)) return obj;
            })
        });
    }

    function clearData() {
        setScanReady(false);
        setDataVariable(initialDataVariable);
        setIframePath("");
        setScannerPath("");
        setFilePath("");
    }

    // modal data here
    const [openModal, setOpenModal] = useState(false);
    async function modalClose(params) {
        setDataVariable(prevState => ({
            ...prevState,
            DVNo: params.DVNo,
            DVDate: params.DVDate,
            JEVNo: params.jev_no,
            ORSNo: params.ORSNo,
            ORSDate: params.ORSDate,
            Office: params.Office,
            Payee: params.PayeeName,
            Particulars: params.particulars,
            xAmount: params.netAmount,
            Department: "",
            KeyWord: [
                params.Payee, params.DVNo, params.check_no, params.TransType, params.Particulars, params.DVDate, params.ORSNo, params.ORSDate, params.jev_no
            ].join().replace(/,/g, " ")
        }));
    }

    // uplaod
    const [attachFile, setAttachFile] = useState();
    const processImage = async () => {
        if (!attachFile) return toast.error("No file to read");
        setLoadSaving("Generating OCR...");
        try {
            setProgress(0);
            if (attachFile.type == 'application/pdf') {
                console.log('here sa');
                const pdf = await getDocument(URL.createObjectURL(attachFile)).promise;
                let allText = '';
                console.log(pdf.numPages);
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({ canvasContext: context, viewport }).promise;

                    const { data: { text } } = await Tesseract.recognize(
                        canvas,
                        'eng',
                        {
                            logger: m => {
                                if (m.status === 'recognizing text') {
                                    setProgress(((pageNum - 1) + m.progress) / pdf.numPages);
                                }
                            }
                        }
                    );
                    allText += text + '\n\n';
                    console.log(text);
                    console.log('here');
                    canvas.remove();

                    setDataVariable(prevState => ({
                        ...prevState,
                        KeyWord: allText
                    }));
                    return toast.error("Successfully generated.");
                }
            } else {
                const { data: { text } } = await Tesseract.recognize(
                    attachFile,
                    "eng",
                    {
                        logger: m => {
                            if (m.status === "recognizing text") {
                                setProgress(m.progress);
                            }
                        }
                    }
                );
                setDataVariable(prevState => ({
                    ...prevState,
                    KeyWord: text
                }));
            }
        } catch (error) {
            console.error("Error processing file:", error);
        } finally {
            setLoadSaving(false);
        }
    };
    async function onSelectFile(event) {
        const file = event.target.files[0];
        if (file) {
            setAttachFile(file);
            const base64File = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
            });

            setIframePath(base64File);
            const filename = file.name;
            const size = Math.ceil(file.size / 1024); // in KB
            const extension = file.name.split('.')[file.name.split('.').length - 1];
            const mimeType = file.type;
            const dateTimeNow = getDateNow('year') + "" + getDateNow('month') + "" + getDateNow('day') + "" + getDateNow('hour') + "" + getDateNow('minute') + "" + getDateNow('second');
            setDataVariable(prevState => ({
                ...prevState,
                fileSize: size,
                pathfile_name: encodeURI(btoa(file.name.split('.')[0]) + "_" + dateTimeNow) + "." + extension,
            }));
        }
    }

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <SearchFromEcardingModal
                openModal={openModal}
                setOpen={() => { setOpenModal(false) }}
                onCloseModal={modalClose}
            />
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <TextField variant="filled" size="small" label="Select Scanner" select value={dataVariable.scannerID} onChange={updateDataVariable} name="scannerID" SelectProps={{ native: true, }} fullWidth>
                            <option></option>
                            {scannerList?.map((option) => (
                                <option key={option.id} value={`${option.id}`}>
                                    {option.scannerName + " - " + option.dedicatedTempPath}
                                </option>
                            ))}
                        </TextField>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="Document Type" value={documentType} inputProps={{ readOnly: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="Reference ID" value={dataVariable.DocReferenceID} onChange={updateDataVariable} name="DocReferenceID" inputProps={{ readOnly: true }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" fullWidth size="small" label="Subject" value={dataVariable.Subject} onChange={updateDataVariable} name="Subject" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" type="date" fullWidth size="small" label="Date Received" value={dataVariable.DateReceived} onChange={updateDataVariable} name="DateReceived" InputLabelProps={{ shrink: true }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" multiline rows={4} fullWidth size="small" label="For" value={dataVariable.LetterFor} onChange={updateDataVariable} name="LetterFor" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="filled" multiline rows={4} fullWidth size="small" label="To" value={dataVariable.LetterTo} onChange={updateDataVariable} name="LetterTo" />
                            </Grid>
                        </Grid>
                        <TextField variant="filled" fullWidth size="small" label="eRAS Notes" value={dataVariable.EArchiveNote} onChange={updateDataVariable} name="EArchiveNote" />
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12}>
                                <TextField variant="filled" multiline rows={4} fullWidth size="small" label="Keyword" value={dataVariable.KeyWord} onChange={updateDataVariable} name="KeyWord" />
                            </Grid>
                        </Grid>
                        <TextField variant="filled" fullWidth size="small" label="File Name" value={dataVariable.pathfile_name} onChange={updateDataVariable} name="pathfile_name" inputProps={{ readOnly: true }} />
                        <TextField variant="filled" fullWidth size="small" label="File Size (KB)" value={dataVariable.fileSize} onChange={updateDataVariable} name="fileSize" inputProps={{ readOnly: true }} />
                        <FormControlLabel control={<Checkbox checked={dataVariable.NeedFollowUp} onChange={updateDataVariable} inputProps={{ 'aria-label': 'controlled' }} name="NeedFollowUp" />} label="Needs Follow Up" />
                        {dataVariable.NeedFollowUp ?
                            <TextField variant="filled" type="date" sx={{ width: '50%' }} size="small" label="Date to Follow Up" value={dataVariable.DateFollowUp} onChange={updateDataVariable} name="DateFollowUp" InputLabelProps={{ shrink: true }} />
                            : ""
                        }
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-end' }}>
                            <Button size="large" color="success" variant="contained" onClick={saveData}>Save</Button>
                            <Button color="info" size="large" variant="contained" onClick={clearData}>New/Clear</Button>
                            <Button color="warning" size="large" variant="contained" onClick={() => { setOpenModal(true); }}>Browse From E-Carding</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 1, height: "815px" }}>
                        <Grid>
                            <Grid item xs={12} md={12}>
                                {scanReady ? <Typography variant="h4" color="primary">NAS Connection Ready!</Typography> : ""}
                                <Iframe width="100%" height="700px" src={iframePath} alt='not found' ></Iframe>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        component="label"
                                    >
                                        Attach File
                                        <input
                                            accept="image/jpg, image/jpeg, application/pdf"
                                            onChange={onSelectFile}
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                    <Button variant="contained" onClick={processImage} color="secondary">Generate OCR</Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button color="info" size="large" variant="contained" onClick={scanNewDocument}>Scan New Document</Button>
                                    <Button color="warning" size="large" variant="contained" onClick={getPreviewScannedDocs} disabled={scanReady ? false : true}>Preview Scanned Document</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default AOMDocumentsData