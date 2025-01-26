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
    { field: 'id', headerName: 'Chapa ID', width: 120 },
    { field: 'isAdmin', headerName: 'Full Name', width: 220, },
    { field: 'firstName', headerName: 'TIME IN', width: 100, },
    { field: 'lastName', headerName: 'TIME OUT', width: 100, },
    { field: 'ST', headerName: 'ST', type: 'number', width: 100, },
    { field: 'OT', headerName: 'OT', type: 'number', width: 100, },
    { field: 'NF', headerName: 'ND', type: 'number', width: 100, },
    { field: 'ND-OT', headerName: 'ND-OT', type: 'number', width: 100,},
    { field: 'Activity', headerName: 'Activity', type: 'number', width: 100, },
    { field: 'gl', headerName: 'GL', type: 'number', width: 100, },
    { field: 'costcenter', headerName: 'Cost Center', type: 'number', width: 100, },
  ];

  const columnGroupingModel = [
    {
      groupId: 'internal_data',
      headerName: '',
      description: '',
      children: [{ field: 'id' }, { field: 'isAdmin' }],
    },
    {
      groupId: 'naming',
      headerName: 'TIME',
      freeReordering: true,
      children: [{ field: 'lastName' }, { field: 'firstName' }],
    },
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
                                {/* <FormControl variant="filled" fullWidth>
                                    <InputLabel>Select Employee Template</InputLabel>
                                    <FilledInput size="small"
                                        disabled
                                        label="Voucher Number"
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <Button size="small" variant="contained" ><SearchIcon fontSize="small" /></Button>
                                        </InputAdornment>
                                        }
                                    />
                                    </FormControl> */}
                                    <TextField fullWidth label="Employee Template" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Location" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Department" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth type="date" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Shifting" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Day Type" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Prepared By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField fullWidth label="Checked By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Confirmed By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Aprroved By" variant="outlined" size="small" />
                                </Grid>
                            
                                <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap: 1}}>
                                    <Button variant="contained" size="small" onClick={openSearchTemplate}>SEARCH EMPLOYEE TEMPLATE</Button>
                                    <Button variant="contained" size="small" onClick={openNewDar} >CREATE NEW DAR</Button>
                                    {selectedRowData ? <Button variant="contained" size="small" color="warning" onClick={handleSubmit}>UPDATE DAR</Button> : 
                                    <Button variant="contained" size="small" color="warning" onClick={handleSubmit}>POST DAR</Button>}
                                    <Button variant="contained" size="small" color="secondary" onClick={handleSubmit}>PRINT DAR</Button>
                                    <Button variant="contained" size="small" color="info" onClick={NewClearData}>New/Clear</Button>
                                </Grid>
                            </Grid>
                        </form>                   
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: '10px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" size="small" onClick={openActionDrawer}>Add DAR Details</Button>
                </Stack>
            <CustomDataGrid 
                columns={ColumnHeader}
                rows={SearchFilter(constMappedData)}
                maxHeight={450}
                height={450}
                slots={{ noRowsOverlay: NoData }}
                columnGroupingModel={columnGroupingModel}
            />
            </Paper>
        </Grid>
        
    </Grid>
    </Fragment>
  )
}

export default DARdata