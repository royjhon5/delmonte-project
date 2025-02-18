import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { OPEN_CUSTOM_MODAL, FORM_DATA } from "../../../store/actions";
import DARDetailsModal from "./DARDetailsModal";

const BatchingDarData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    // const queryClient = useQueryClient();
    const { data: mainData } = hookContainer('/get-activity');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.activityname.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'darno', headerName: 'DAR No',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                    
                </Box>
            ),
        },
        {
            field: 'batchno', headerName: 'Batch No',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'dardate', headerName: 'DAR Date',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'location', headerName: 'Location',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'department', headerName: 'Department',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'shift', headerName: 'Shift',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'daytype', headerName: 'Day Type',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalhc', headerName: 'Total Head Count',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalST', headerName: 'Total ST',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalOT', headerName: 'Totat OT',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalnd', headerName: 'Total ND',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'totalndot', headerName: 'Total NDOT',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'status', headerName: 'Status',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'batchby', headerName: 'Batch By',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'batchdate', headerName: 'Batch Date',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: 'remarks', headerName: 'Remarks',
            renderCell: () => (
                <Box sx={{ paddingLeft: 1 }}>
                
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            align: 'right',
            renderCell: (data) => {
                const SelectData = () => {
                    const obj = {
                        data: data.row,
                    };
                    dispatch({ type: FORM_DATA, formData: obj });
                    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
                };
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button color="primary" variant="contained" size="small" onClick={SelectData}>
                            Select
                        </Button>
                    </Box>
                )
            }
        }
    ];


    return (
        <>
            <DARDetailsModal />
            <Paper>
                <Grid container spacing={1} sx={{ padding: '15px'}}>
                    <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', flexDirection: 'row', gap:1, alignItems:'center' }}>
                        <Typography>Search By Period Date</Typography>
                        <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '13%', lg: '13%' } }} />
                        <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '13%', lg: '13%' } }} />
                        <Button variant="contained">Go</Button>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', flexDirection: 'row', gap:1, alignItems:'center' }}>
                        <Typography>DAR No</Typography>
                        <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '13%', lg: '13%' } }} />
                    </Grid>
                </Grid>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={450}
                    height={450}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                />
            </Paper>
        </>
    )
}

export default BatchingDarData