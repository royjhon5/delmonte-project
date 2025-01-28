import { Box, Button, Grid, TextField, Paper, Stack, Divider, Typography } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import CustomDialog from "../../../../components/CustomDialog";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";
import ConfirmationSwal from "../../../../components/Swal/CloseCancelSubmitSwal2";
import { toast } from "sonner";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";

const TransferEmployeeModal = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const [loadSaving, setLoadSaving] = useState(false);

    const [constMappedData, setConstMappedData] = useState([]);
    const loadDARDetailAvailable = useCallback(async (headerID = 0) => {
        const response = await http.get(`/get-dardetail?header_id=${headerID}&group=true`); // add group paramater to group repeated employee detail
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

    const [darID, setDARID] = useState('');
    const [darDate, setDARDate] = useState('');
    const [selectedDARID, setSelectedDARID] = useState('');
    const [darHeaderList, setDARHeaderList] = useState([]);
    const loadDARHeaderList = useCallback(async (headerID = 0, date = "") => {
        const response = await http.get(`/get-darheaderavailable?header_id=${headerID}&date=${date}`); // add group paramater to group repeated employee detail
        setDARHeaderList(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);

    const [openConfirmationTransfer, setOpenConfirmationTransfer] = useState(false);
    async function confirmationTransferClose() {
        setOpenConfirmationTransfer(false);
    }
    const [selectedDetailChapaID, setSelectedDetailChapaID] = useState('');
    const confirmTransferEmployee = async () => {
        setLoadSaving("Saving...");
        const response = await http.post('/post-transferdardetail', {
            chapa_id: selectedDetailChapaID,
            dar_header_id: selectedDARID
        });
        if (response.data.success) {
            toast.success(response.data.message);
            loadDARDetailAvailable(darID);
        } else toast.error(response.data.message);
        setLoadSaving(false);
        setOpenConfirmationTransfer(false);
    }

    const ColumnHeader = [
        {
            field: 'ChapaID', headerName: 'Chapa ID', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.ChapaID}
                </Box>
            ),
        },
        {
            field: 'name', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <Box>
                    {params.row.emp_fname + " " + params.row.emp_mname + " " + params.row.emp_lname + " " + params.row.emp_ext_name}
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
                    if (!selectedDARID) return toast.error("Please select DAR Header you want this employee to transfer.");
                    setSelectedDetailChapaID(params.row.ChapaID);
                    setOpenConfirmationTransfer(true);
                }
                return (
                    <Box sx={{ paddingRight: 1 }}>
                        <Button variant="contained" fullWidth color="primary" size="small" onClick={SelectedRow}>Transfer</Button>
                    </Box>
                )
            }
        }
    ];

    // useEffects
    useEffect(() => {
        if (passedData.id) {
            loadDARDetailAvailable(passedData.id);
            loadDARHeaderList(passedData.id, passedData.date);
            setDARDate(passedData.date);
            setDARID(passedData.id);
        }
    }, [passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <ConfirmationSwal
                openConfirmation={openConfirmationTransfer}
                maxWidth="xs"
                onClose={confirmationTransferClose}
                onConfirm={confirmTransferEmployee}
                confirmTitle="Are you sure you want to transfer this employee?"
            />
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={"Transfer Employee"}
                onClose={() => { onCloseModal({ success: true }); }}
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
                        <Grid item xs={12} md={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h5" component="h2">List of DAR Header with same Date: {darDate}</Typography>
                            <TextField sx={{ mt: 1 }} size="medium" label="Select DAR Header" select value={selectedDARID} onChange={(e) => { setSelectedDARID(e.target.value) }} name="selectedDARID" SelectProps={{ native: true, }} fullWidth>
                                <option></option>
                                {darHeaderList?.map((option) => (
                                    <option key={option.id} value={`${option.id}`}>
                                        {option.department + " | " + option.group_name + " | " + option.location_name + " | Shifting " + option.shift + " | " + option.daytype_name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
}

export default TransferEmployeeModal;
