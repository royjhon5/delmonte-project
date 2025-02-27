import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";

const SearchDARHeaderModal = (props) => {
    const { openModal, onCloseModal, isUpdate } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const [constMappedData, setConstMappedData] = useState([]);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.location.toLowerCase().includes(search.toLowerCase()) ||
            row.daytype.toLowerCase().includes(search.toLowerCase()) ||
            row.group_name.toLowerCase().includes(search.toLowerCase()) ||
            row.department.toLowerCase().includes(search.toLowerCase())
        );
    };
    
    const loadData = useCallback(async () => {
        const response = await http.get(`/get-darheader`);
        if (response.data.length > 0) {
            setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
                return { ...row, id: row.id };
            }) : []);
        }
    }, []);

    useEffect(() => {
        if(openModal) loadData();
    }, [openModal]);

    const ColumnHeader = [
        {
            field: 'dar_no', headerName: 'DAR No.', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.dar_no}
                </Box>
            ),
        },
        { field: 'group_name', headerName: 'Group', flex: 1, },
        { field: 'department', headerName: 'Department', flex: 1, },
        { field: 'location', headerName: 'Location', flex: 1, },
        {
            field: 'shift_time_in_hour', headerName: 'Work Schedule', flex: 1,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.shift_time_in_hour + params.row.shift_time_in_min + " - " + params.row.shift_time_out_hour + params.row.shift_time_out_min}
                </Box>
            ),
        },
        { field: 'xDate', headerName: 'Date', flex: 1, },
        { field: 'dar_status', headerName: 'Status', flex: 1, },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const SelectedRow = () => {
                    onCloseModal(params.row);
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button variant="contained" fullWidth color="primary" size="small" onClick={SelectedRow}>Select</Button>
                    </Box>
                )
            }
        }
    ];

    return (
        <CustomDialog
            open={openModal}
            maxWidth={'lg'}
            DialogTitles={"Search DAR Header"}
            onClose={() => { closeCurrentModal() }}
            DialogContents={
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Paper>
                            <Stack sx={{ display: 'flex', paddingBottom: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                            </Stack>
                            <CustomDataGrid
                                columns={ColumnHeader}
                                rows={SearchFilter(constMappedData)}
                                maxHeight={450}
                                height={450}
                                slots={{ noRowsOverlay: NoData }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            }
        />
    );
}

export default SearchDARHeaderModal;
