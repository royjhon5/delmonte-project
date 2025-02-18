import { Box, Button, Grid, TextField, } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../store/actions";
import { hookContainer } from "../../../hooks/globalQuery";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";

const DARDetailsModal = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomModal);
    const CloseDialog = () => { dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false }); dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });}
    const { data: mainData } = hookContainer('/get-activity');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];

    const ColumnHeader = [
        {
            field: 'darno', headerName: 'Chapa ID', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                    
                </Box>
            ),
        },
        {
            field: 'batchno', headerName: 'Full Name', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'dardate', headerName: 'Date', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'location', headerName: 'IN', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'department', headerName: 'OUT', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalST', headerName: 'Total ST', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalOT', headerName: 'Totat OT', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalnd', headerName: 'Total ND', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalndot', headerName: 'Total NDOT', flex:1,
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
    ];

    return (
        <CustomDialog
            open={open}
            maxWidth={'lg'}
            DialogTitles={"DAR Details"}
            onClose={CloseDialog}
            DialogContents={
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="DAR Ref No" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="Date" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="Shift" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="Location" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="Department" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth size="small" label="Day Type" />
                    </Grid>
                    <Grid item xs={12}>
                    <CustomDataGrid
                        columns={ColumnHeader}
                        maxHeight={450}
                        height={450}
                        rows={constMappedData}
                        slots={{ noRowsOverlay: NoData }}
                    />
                    </Grid>
                    <Grid xs={4} sx={{mt:1, mr:1}}>
                        <TextField fullWidth size="small" label="Batch No" />   
                    </Grid>
                    <Grid xs={4} sx={{mt:1}}>
                        <TextField fullWidth size="small" label="Remarks" />   
                    </Grid>
                </Grid>
            }
            DialogAction={
                <Grid container spacing={1} >
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent:'flex-end', alignItems:'flex-end', flexDirection:'row', gap: 1 }}>
                        <Button variant="contained" color="info"> 
                            Set Pending
                        </Button>
                        <Button variant="contained">
                            Approved
                        </Button>
                    </Grid>
                </Grid>
            }
        />
    );
}


export default DARDetailsModal;
