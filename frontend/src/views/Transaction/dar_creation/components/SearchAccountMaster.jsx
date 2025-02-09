import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";

const SearchAccountMasterModal = (props) => {
    const { openModal, onCloseModal, isUpdate } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const { data: mainDataHeader } = hookContainer('/get-accounttocharge');
    const constMappedData = Array.isArray(mainDataHeader) ? mainDataHeader.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.activityname.toLowerCase().includes(search.toLowerCase()) ||
            row.costcenter.toLowerCase().includes(search.toLowerCase()) ||
            row.gl_code.toLowerCase().includes(search.toLowerCase())
        );
    };
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.invalidateQueries(['/get-accounttocharge']);
    }, [openModal]);

    const ColumnHeader = [
        {
            field: 'activityname', headerName: 'Activity', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.activityname}
                </Box>
            ),
        },
        { field: 'costcenter', headerName: 'Cost Center', flex: 1, },
        { field: 'gl_code', headerName: 'GL Code', flex: 1, },
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
            DialogTitles={"Search Activity (Account Master)"}
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

export default SearchAccountMasterModal;
