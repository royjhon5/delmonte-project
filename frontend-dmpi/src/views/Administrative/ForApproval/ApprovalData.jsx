import { Box, Button, Chip, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL, FORM_DATA } from "../../../store/actions";
// import { useQueryClient } from "@tanstack/react-query";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewDataDialog from "./components/view-data-dialog";

const ApprovalData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    // const queryClient = useQueryClient();
    // const [selectedID, setSelectedID] = useState(0);
    const { data: mainData } = hookContainer('/get-forapproval');
    const constMappedData = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.soa_no.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'soa_no', headerName: 'SOA No', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.soa_no}
                </Box>
            ),
        },
        {
            field: 'xDate', headerName: 'Date', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.xDate}
                </Box>
            ),
        },
        {
            field: 'soa_status', headerName: 'Status', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    <Chip size="small" color="error" label={data.row.soa_status} />
                </Box>
            ),
        },
        {
            field: 'status_remarks', headerName: 'Remarks', flex:1,
            renderCell: (data) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {data.row.status_remarks}
                </Box>
            ),
        },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (data) => {
                const SelectData = () => {
                    const obj = {
                        id: data.row.id,
                        soa_id: data.row.soa_id
                    };
                    dispatch({ type: FORM_DATA, formData: obj });
                    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
                    dispatch({ type: IS_UPDATE_FORM, isUpdateForm: true });
                };
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button startIcon={<VisibilityIcon fontSize="inherit" />} variant="contained" color="primary" size="small" onClick={SelectData}>
                            View
                        </Button>
                    </Box>
                )
            }
        }
    ];

    return (
        <>
        <ViewDataDialog />
            <Paper>
                <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                </Stack>
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

export default ApprovalData