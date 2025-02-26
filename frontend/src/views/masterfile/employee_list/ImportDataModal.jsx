import { Box, Button, Grid, Typography } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_IMPORT_DATA } from "../../../store/actions";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import { hookContainer } from "../../../hooks/globalQuery";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import http from "../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const fileTypes = ["XLS", "XLSX", "CSV"];

const ImportData = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { data: mainData } = hookContainer('/get-employee-imported');
    const open = useSelector((state) => state.customization.openImportData);
    const [file, setFile] = useState(null);
    const [duplicateRows, setDuplicateRows] = useState([]);
    const [verifyBtn, setVerifyBtn] = useState(true);
    const [deleteBtn, setDeleteBtn] = useState(true);
    const [saveBtn, setSaveBtn] = useState(true);
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => ({
        ...row, id: row.id
    })) : [];

    const validateDuplicates = async () => {
        try {
          const response = await http.post("/validate-duplicates", constMappedData);    
          setDuplicateRows(response.data.duplicates);
          setDeleteBtn(false);
        } catch (error) {
          console.error("Error:", error.response ? error.response.data : error.message);
        }
    };

    const SaveAllData = async () => {
        if(duplicateRows.length > 0) return toast.error('Delete duplicates first before saving.');
        try {
          const response = await http.post("/post-saveemployelistimport", constMappedData);    
            toast.success(response.data.success);
            queryClient.invalidateQueries(['/get-employee-imported']);
            queryClient.invalidateQueries(['/get-employee']);
        } catch (error) {
          console.error("Error:", error.response ? error.response.data : error.message);
        }
    };

    const CloseDialog = () => {
        dispatch({ type: OPEN_IMPORT_DATA, openCustomModal: false });
        setDuplicateRows([]);   
        setVerifyBtn(true);
        setDeleteBtn(true);
        setFile(null);
    };

    const handleFileChange = (file) => {
        setFile(file);
    };

    const uploadFile = async () => {    
        const formData = new FormData();
        formData.append("excel", file);  

        try {
            const response = await http.post("/import-excel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });  
            toast.success(`Failed: ${response.data.success} | Success: ${response.data.failure}`);
            queryClient.invalidateQueries(['/get-employee-imported']);
            setVerifyBtn(false);
            setFile(null);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const deleteDataMultiple = useMutation({
        mutationFn: (duplicateRows) => http.post(`/remove-duplicate`, { ids: duplicateRows }), 
        onSuccess: () => {
            toast.success('Selected data has been deleted successfully.');
            queryClient.invalidateQueries(['/get-employee-imported']);
            setDuplicateRows([]);
            setVerifyBtn(true);
            setDeleteBtn(true);
            setSaveBtn(false);
        }
    });
    
    const DeleteDataMultiple = () => {
        deleteDataMultiple.mutate(duplicateRows);
    };
    const ColumnHeader = [
        { field: 'chapa_id', headerName: 'Chapa ID', width: 200,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1, color: duplicateRows.some(row => row.chapa_id === data.row.chapa_id) ? 'red' : 'inherit' }}>
                    {data.row.chapa_id}
                </Box>
            ),
        },
        { field: 'lastname', headerName: 'LAST NAME', width: 150 },
        { field: 'firstname', headerName: 'FIRST NAME', width: 150 },
        { field: 'middlename', headerName: 'MIDDLE NAME', width: 150 },
        { field: 'extname', headerName: 'EXT. NAME', width: 100 }
    ];

    return (
        <>
            <CustomDialog
                open={open}
                maxWidth={'md'}
                DialogTitles={"IMPORT DATA"}
                onClose={CloseDialog}
                DialogContents={
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>File upload</Typography>
                                <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
                                <Typography fontSize={12}>File name: {file && <span>{file.name}</span>}</Typography>
                            </Grid>
                            <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" disabled={!file} onClick={uploadFile}>Upload</Button>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <CustomDataGrid
                                    columns={ColumnHeader}
                                    maxHeight={450}
                                    height={450}
                                    rows={constMappedData}
                                    slots={{ noRowsOverlay: NoData }}
                                    checkboxSelection
                                    disableRowSelectionOnClick={true}
                                    rowSelectionModel={constMappedData
                                        .filter(row => duplicateRows.includes(row.chapa_id))
                                        .map(row => row.id)
                                    }
                                />
                                    <Typography color={duplicateRows.length > 0 ? "error" : "success"} sx={{ mt: 1 }}>
                                        {duplicateRows.length > 0 
                                            ? `Warning: ${duplicateRows.length} duplicate(s) found!`
                                            : "No duplicates found."
                                        }
                                    </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                }
                DialogAction={
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                            <Button variant="contained" fullWidth color="error" disabled={deleteBtn} onClick={DeleteDataMultiple}>DELETE ALREADY IN THE LIST</Button>
                            <Button variant="contained" fullWidth color="warning" disabled={verifyBtn} onClick={validateDuplicates}>VERIFY ALREADY EXIST</Button>
                            <Button variant="contained" fullWidth disabled={saveBtn} onClick={SaveAllData}>SAVE TO EMPLOYEE LIST</Button>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default ImportData;
