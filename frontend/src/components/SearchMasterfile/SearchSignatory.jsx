import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../CustomDataGrid";
import NoData from "../CustomDataTable/NoData";
import CustomDialog from "../CustomDialog";
import { useState, useEffect } from "react";
import { hookContainer } from "../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";

const SearchSignatoryModal = (props) => {
    const { openModal, onCloseModal, isUpdate } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const { data: mainDataHeader } = hookContainer('/get-signatory');
    const constMappedData = Array.isArray(mainDataHeader) ? mainDataHeader.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.name.toLowerCase().includes(search.toLowerCase())
        );
    };
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.invalidateQueries(['/get-signatory']);
    }, [openModal]);

    const ColumnHeader = [
        {
            field: 'name', headerName: 'Signatory Name', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.name}
                </Box>
            ),
        },
        { field: 'designation', headerName: 'Designation', flex: 1, },
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

export default SearchSignatoryModal;
