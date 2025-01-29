import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";

const ViewDARDetailModal = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const [constMappedData, setConstMappedData] = useState([]);
    const loadDARDetailList = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-dardetail?header_id=${headerID}`); // add group paramater to group repeated employee detail
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.ChapaID.toLowerCase().includes(search.toLowerCase()) ||
            row.emp_lname.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 150,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'fullname', headerName: 'Name', width: 250,
            renderCell: (params) => (
                <Box>
                    {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
                </Box>
            ),
        },
        { field: 'activity', headerName: 'Activity', width: 250, },
        { field: 'time_in', headerName: 'Time In', width: 100, },
        { field: 'time_out', headerName: 'Time Out', width: 100, },
        { field: 'st', headerName: 'ST', width: 100, },
        { field: 'ot', headerName: 'OT', width: 100, },
        { field: 'nd', headerName: 'ND', width: 100, },
        { field: 'ndot', headerName: 'NDOT', width: 100, },
        { field: 'gl', headerName: 'GL Code', width: 250, },
        { field: 'cost_center', headerName: 'Cost Center', width: 250, },
    ];

    // useEffects
    useEffect(() => {
        console.log(passedData);
        if (passedData.id) {
            loadDARDetailList(passedData.id);
        }
    }, [passedData]);

    return (
        <CustomDialog
            open={openModal}
            maxWidth={'lg'}
            DialogTitles={"DAR Details"}
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

export default ViewDARDetailModal;
