import { Box, Button, Grid, TextField, Paper, Stack, Divider, Typography, IconButton } from "@mui/material";
import CustomDataGrid from "../../../../components/CustomDataGrid/index.jsx";
import NoData from "../../../../components/CustomDataTable/NoData.jsx";
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { useState, useEffect, useCallback } from "react";
import http from "../../../../api/http.jsx";
import ConfirmationSwal from "../../../../components/Swal/CloseCancelSubmitSwal2";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import LoadSaving from "../../../../components/LoadSaving/Loading.jsx";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewDARDetailModal from "../components/ViewDARDetail";

const AddSOADetailModal = (props) => {
    const { openModal, onCloseModal, passedData } = props;
    const closeCurrentModal = () => {
        onCloseModal(false);
    }

    const dispatch = useDispatch();
    const [loadSaving, setLoadSaving] = useState(false);

    const [soaID, setSOAID] = useState('');
    const [soaDate, setSOADate] = useState('');
    const [constMappedData, setConstMappedData] = useState([]);
    const loadDARHeaderList = useCallback(async (headerID = 0, date = "") => {
        const response = await http.get(`/get-darheaderforsoa?header_id=${headerID}&date=${date}`); // add group paramater to group repeated employee detail
        setConstMappedData(Array.isArray(response.data) ? response.data.map((row) => {
            return { ...row, id: row.id }
        }) : []);
    }, []);
    const [search, setSearch] = useState('');
    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.department.toLowerCase().includes(search.toLowerCase()) ||
            row.group_name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'group_name', headerName: 'Group', width: 250,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.group_name}
                </Box>
            ),
        },
        { field: 'client_name', headerName: 'Client', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'department', headerName: 'Department', flex: 1 },
        { field: 'shift', headerName: 'Shift', flex: 1 },
        {
            field: "action", headerAlign: 'right',
            headerName: '',
            width: 150,
            align: 'right',
            renderCell: (params) => {
                const SelectedRow = () => {
                    addDARDetails(params.row.id);
                }
                const viewDARDetails = () => {
                    setPassDataHeader({ id: params.row.id });
                    setOpenViewDARDetails(true);
                }
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Button variant="contained" color="primary" size="small" onClick={viewDARDetails}>
                            <VisibilityIcon fontSize="inherit" /> View
                        </Button>
                        <Button variant="contained" color="success" size="small" onClick={SelectedRow}>
                            <LibraryAddIcon fontSize="inherit" /> Add
                        </Button>
                    </Box>
                )
            }
        }
    ];

    const [darDetailID, setDARDetailID] = useState('');
    const [openConfirmationAdd, setOpenConfirmationAdd] = useState(false);
    async function confirmationAddClose() {
        setOpenConfirmationAdd(false);
    }
    const addDARDetails = (id) => {
        setDARDetailID(id);
        setOpenConfirmationAdd(true);
    }
    const confirmAddDARDetail = async () => {
        setLoadSaving("Please wait! Adding...");
        const response = await http.post('/post-adddardetails', { id: darDetailID, soa_id: soaID });
        if (response.data.success) {
            toast.success(response.data.message);
            loadDARHeaderList(soaID, soaDate);
        } else toast.error(response.data.message);
        setLoadSaving(false);
        setOpenConfirmationAdd(false);
    }

    // modal
    const [openViewDARDetails, setOpenViewDARDetails] = useState(false);
    const [passDataHeader, setPassDataHeader] = useState({});
    async function modalCloseViewDARDetails(params) {
        setOpenViewDARDetails(false);
    }

    // useEffects
    useEffect(() => {
        if (passedData.id) {
            loadDARHeaderList(passedData.id, passedData.date);
            setSOADate(passedData.date);
            setSOAID(passedData.id);
        }
    }, [passedData]);

    return (
        <>
            {loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
            <ConfirmationSwal
                openConfirmation={openConfirmationAdd}
                maxWidth="xs"
                onClose={confirmationAddClose}
                onConfirm={confirmAddDARDetail}
                confirmTitle="Are you sure you want to add details of this DAR?"
            />
            <ViewDARDetailModal
                openModal={openViewDARDetails}
                onCloseModal={modalCloseViewDARDetails}
                passedData={passDataHeader}
            />
            <CustomDialog
                open={openModal}
                maxWidth={'lg'}
                DialogTitles={"Add SOA Detail"}
                onClose={() => { onCloseModal({ success: true }); }}
                DialogContents={
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Paper>
                                <Stack sx={{ display: 'flex', paddingBottom: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Typography variant="h5" component="h2" sx={{ marginTop: "1%" }}>List of DAR with Date: {soaDate}</Typography>
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
                    </Grid>
                }
            />
        </>
    );
}

export default AddSOADetailModal;
