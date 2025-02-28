import { Box, Button, Grid, TextField, Paper, Stack } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { OPEN_CUSTOM_MODAL } from "../../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useEffect, useState } from "react";
import { hookContainer } from "../../../../hooks/globalQuery";

const DetailModal = ({ RefreshData }) => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openCustomModal);
    const headerData = useSelector((state) => state.customization.searchSelectedData);
    const CloseDialog = () => {
        dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
    }

    const { data: mainData } = hookContainer('/get-employee');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.chapa_id.toLowerCase().includes(search.toLowerCase()) ||
            row.lastname.toLowerCase().includes(search.toLowerCase())
        );
    };

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
        { field: 'activityname', headerName: 'Activity', flex: 1, },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'center',
            renderCell: (params) => {
                const SelectedRow = async () => {
                    var formVariable = {
                        template_employehdr_idlink: headerData.id,
                        ChapaID: params.row.chapa_id,
                        last_name: params.row.lastname,
                        first_name: params.row.firstname,
                        middle_name: params.row.middlename,
                        ext_name: params.row.extname,
                        default_acitivity_idlink: params.row.default_activity_idlink,
                        activityname: params.row.activityname,
                        gl_code: params.row.gl_code,
                        costcenter: params.row.costcenter,
                    };
                    try {
                        const response = await http.post('/post-employeetemplatedetail', formVariable);
                        if (response.data.success) {
                            RefreshData();
                            CloseDialog();
                            toast.success('Person added successfully.');
                        } else {
                            toast.error(response.data.message);
                        }
                    } catch (error) {
                        console.error('Error saving:', error);
                        toast.error('Failed to save.');
                    }
                    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomSearchModal: false });
                }
                return (
                    <>
                        {
                            params.row.default_activity_idlink > 0 ?
                                <Box sx={{ paddingRight: 1 }}>
                                    <Button variant="contained" fullWidth color="primary" size="small" onClick={SelectedRow}>Add Employee</Button>
                                </Box>
                                : "NO ACTIVITY"
                        }
                    </>
                )
            }
        }
    ];


    return (
        <CustomDialog
            open={open}
            maxWidth={'lg'}
            DialogTitles={"Search Employee"}
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

DetailModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default DetailModal;
