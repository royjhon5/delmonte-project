import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";

const SearchEmployeeModal = (props) => {
    const { openModal, onCloseModal, isUpdate } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const [constMappedData, setConstMappedData] = useState([]);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.chapa_id.toLowerCase().includes(search.toLowerCase()) ||
            row.lastname.toLowerCase().includes(search.toLowerCase())
        );
    };
    
    const loadData = useCallback(async () => {
        const response = await http.get(`/get-employee`);
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
            field: 'chapa_id', headerName: 'Chapa ID', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.chapa_id}
                </Box>
            ),
        },
        {
            field: 'name', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.firstname + " " + params.row.middlename + " " + params.row.lastname + " " + params.row.extname}
                </Box>
            ),
        },
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
            DialogTitles={"Search Employee"}
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

export default SearchEmployeeModal;
