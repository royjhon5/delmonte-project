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
import { useQueryClient } from "@tanstack/react-query";

const fileTypes = ["XLS", "XLSX", "CSV"];

const ImportData = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { data: mainData } = hookContainer('/get-employee-imported');
    const open = useSelector((state) => state.customization.openImportData);
    const [file, setFile] = useState(null);
    const [duplicateRows, setDuplicateRows] = useState([]);
    const [verified, setVerified] = useState(false); 

    // Map data for the DataGrid
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => ({
        ...row, id: row.id
    })) : [];

    const validateDuplicates = async () => {
        const filteredData = mainData.map(row =>
          Object.keys(row).reduce((acc, key) => {
            if (key !== "id" && key !== "name") acc[key] = row[key];
            return acc;
          }, {})
        );
      
        try {
          const response = await http.post("/validate-duplicates", filteredData);    
          setDuplicateRows(response.data.duplicates);
        } catch (error) {
          console.error("Error:", error.response ? error.response.data : error.message);
        }
    };

    const CloseDialog = () => {
        dispatch({ type: OPEN_IMPORT_DATA, openCustomModal: false });
        setDuplicateRows([]); 
        setVerified(false);
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
        } catch (error) {
            console.error("Error uploading file:", error);
        }
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
                                />
                                {verified && (
                                    <Typography color={duplicateRows.length > 0 ? "error" : "success"} sx={{ mt: 1 }}>
                                        {duplicateRows.length > 0 
                                            ? `Warning: ${duplicateRows.length} duplicate(s) found!`
                                            : "No duplicates found."
                                        }
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                }
                DialogAction={
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                            <Button variant="contained" fullWidth color="error">DELETE ALREADY IN THE LIST</Button>
                            <Button variant="contained" fullWidth color="warning" onClick={validateDuplicates}>VERIFY ALREADY EXIST</Button>
                            <Button variant="contained" fullWidth disabled={duplicateRows.length > 0}>SAVE TO EMPLOYEE LIST</Button>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default ImportData;
