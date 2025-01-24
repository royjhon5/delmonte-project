import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { OPEN_CUSTOM_SEARCH_MODAL, SEARCH_SELECTED_DATA } from "../../../../store/actions";
import http from "../../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";

const SearchHeaderModal = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomSearchModal);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_SEARCH_MODAL, openCustomSearchModal: false });
        
    }
    const { data: mainDataHeader } = hookContainer('/get-employeetemplateheader');
    const constMappedData = Array.isArray(mainDataHeader) ? mainDataHeader.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.TName.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'TName', headerName: 'Template Name', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.TName}
                </Box>
            ),
        },
        { field: 'activityname', headerName: 'Activity', flex: 1, },
        { field: 'department', headerName: 'Department', flex: 1, },
        { field: 'emp_group', headerName: 'Group', flex: 1, },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const SelectedRow = () => {
                    dispatch({ type: OPEN_CUSTOM_SEARCH_MODAL, openCustomSearchModal: false });
                    dispatch({ type: SEARCH_SELECTED_DATA, searchSelectedData: params.row });
                    // RefreshData();
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
            open={open}
            maxWidth={'lg'}
            DialogTitles={"Search Employee Template Header"}
            onClose={CloseDialog}
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

SearchHeaderModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default SearchHeaderModal;
