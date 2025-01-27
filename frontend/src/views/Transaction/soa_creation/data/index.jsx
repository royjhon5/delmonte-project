import { Button, Grid, Paper, Stack, TextField } from "@mui/material"
import { Fragment, useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hookContainer } from "../../../../hooks/globalQuery";
import http from "../../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPEN_CUSTOM_MODAL, OPEN_CUSTOM_SEARCH_MODAL, OPEN_DELETESWAL, OPEN_NEW_DAR } from "../../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../../components/Swal/DeleteSwal";
import SearchIcon from '@mui/icons-material/Search';
import ActionDrawer from "../components/action-drawer";
import SearchTemplate from "../components/SearchTemplate";
import NewDarHeader from "../components/new-dar";

const DARdata = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data: userData } = hookContainer('/get-users');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedID, setSelectedID] = useState(0);
  const [UserName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [fullName, setFullName] = useState('');
  const [descripTion, setDescription] = useState('');
  const constMappedData = Array.isArray(userData) ? userData.map((row) => {
    return { ...row, id: row.LoginID  };
  }) : [];
  const SearchFilter = (rows) => {
    return rows.filter(row =>
        row.Username.toLowerCase().includes(search.toLowerCase()) || 
        row.UserLevel.toLowerCase().includes(search.toLowerCase())
    );
  };



  const ColumnHeader = [
    { field: 'activity', headerName: 'Activity', width: 120 },
    { field: 'GL', headerName: 'GL', width: 100, },
    { field: 'Cost Center', headerName: 'Cost Center', width: 100, },
    { field: 'ST HRS', headerName: 'ST HRS', width: 100, },
    { field: 'OT HRS', headerName: 'OT HRS', type: 'number', width: 100, },
    { field: 'ND HRS', headerName: 'ND HRS', type: 'number', width: 100, },
    { field: 'ND-OT HRS', headerName: 'ND-OT HRS', type: 'number', width: 100, },
    { field: 'ST RATES', headerName: 'ND-OT', type: 'number', width: 100,},
    { field: 'ST AMNT', headerName: 'ST AMNT', type: 'number', width: 100, },
    { field: 'OT AMNT', headerName: 'OT AMNT', type: 'number', width: 100, },
    { field: 'ND AMNT', headerName: 'ND AMNT', type: 'number', width: 100, },
    { field: 'ND-OT AMNT', headerName: 'ND-OT AMNT', type: 'number', width: 130, },
    { field: 'TOTAL AMOUNT', headerName: 'TOTAL AMOUNT', type: 'number', width: 130, },
    { field: 'HC', headerName: 'HC', type: 'number', width: 100, },
  ];



  const handleSubmit = async () => {
    const UserRegistrationData = { 
      LoginID: selectedRowData ? selectedRowData.LoginID : 0,
      Username: UserName,
      UserLevel: userLevel, 
      FullName: fullName,
      Description: descripTion,
    };
    try {
      await UserData.mutateAsync(UserRegistrationData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const UserData = useMutation({
    mutationFn: (UserRegistrationData) => http.post('/user_registration', UserRegistrationData),
    onSuccess: () => {
        queryClient.invalidateQueries(['/get-users']);
        toast.success('New user has been saved.');
        setSelectedRowData(null);
        setUserName('');
        setUserLevel('');
        setFullName('');
        setDescription('');
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  const selectToDelete = (data) => {
    setSelectedID(data);
    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
  }

  const deleteData = useMutation({
    mutationFn: () => http.delete(`/delete-user?LoginID=${selectedID}`),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries(['/get-users']);
      dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
    }
  });
  
  const DeleteData = () => {
    deleteData.mutate(selectedID);
  };

  const NewClearData = () => {
    setSelectedRowData(null);
    setUserName('');
    setUserLevel('');
    setFullName('');
    setDescription('');
  }

  const openActionDrawer = () => {
    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
  }

  const openSearchTemplate = () => {
    dispatch({ type: OPEN_CUSTOM_SEARCH_MODAL, openCustomSearchModal: true });
  }

  const openNewDar = () => {
    dispatch({ type: OPEN_NEW_DAR, openNewDar: true });
  }


  return (
    <Fragment>
    <ActionDrawer />
    <SearchTemplate />
    <NewDarHeader />
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Grid container spacing={0.5}>
    <Grid item xs={12} md={12}>
            <Paper sx={{padding: 2}}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="SOA Number" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Location" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Department" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth type="date" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Period Covered" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Day Type" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Prepared By" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Checked By" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Confirmed By" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Aprroved By" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="STATUS" variant="outlined" size="small" inputProps={{ readOnly: true }} />
                                </Grid>
                            
                                <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap: 1}}>
                                    <Button variant="contained" size="small" onClick={openSearchTemplate}>SEARCH POSTED DAR TEMPLATES</Button>
                                    <Button variant="contained" size="small" onClick={openNewDar} >CREATE NEW SOA</Button>
                                    {selectedRowData ? <Button variant="contained" size="small" color="warning" onClick={handleSubmit}>UPDATE SOA</Button> : 
                                    <Button variant="contained" size="small" color="warning" onClick={handleSubmit}>POST SOA</Button>}
                                    <Button variant="contained" size="small" color="error" onClick={handleSubmit}>SUBMIT SOA</Button>
                                    <Button variant="contained" size="small" color="secondary" onClick={handleSubmit}>PRINT SOA</Button>
                                    <Button variant="contained" size="small" color="info" onClick={NewClearData}>NEW/CLEAR</Button>
                                </Grid>
                            </Grid>
                        </form>                   
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" size="small" onClick={openActionDrawer}>ADD SOA DETAILS</Button>
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
    </Fragment>
  )
}

export default DARdata