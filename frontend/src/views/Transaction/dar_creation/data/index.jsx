import { Box, Button, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, Paper, Stack, TextField } from "@mui/material"
import { Fragment, useState } from "react";
import CustomDataGrid from "../../../../components/CustomDataGrid";
import NoData from "../../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hookContainer } from "../../../../hooks/globalQuery";
import http from "../../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPEN_CUSTOM_MODAL, OPEN_DELETESWAL } from "../../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../../components/Swal/DeleteSwal";
import SearchIcon from '@mui/icons-material/Search';

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
    { field: 'id', headerName: 'Chapa ID', width: 100 },
    { field: 'isAdmin', type: 'boolean', headerName: 'Full Name', width: 200 },
    {
        field: 'firstName',
        headerName: 'TIME IN',
        width: 100,
    },
    {
        field: 'lastName',
        headerName: 'TIME OUT',
        width: 100,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
    },
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

  const openCustomModal = () => {
    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: true });
  }

  return (
    <Fragment>
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
            <Paper sx={{padding: 2}}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                <FormControl variant="filled" fullWidth>
                                    <InputLabel>Select Employee Template</InputLabel>
                                    <FilledInput size="small"
                                        disabled
                                        label="Voucher Number"
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <Button size="small" variant="contained" ><SearchIcon /></Button>
                                        </InputAdornment>
                                        }
                                    />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Location" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Department" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth type="date" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Shifting" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField fullWidth label="Day Type" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Prepared By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Checked By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Confirmed By" variant="outlined" size="small" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Aprroved By" variant="outlined" size="small" />
                                </Grid>
                            
                                <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap: 1, justifyContent:'flex-end'}}>
                                    {selectedRowData ? <Button variant="contained" size="large" onClick={handleSubmit}>Update</Button> : 
                                    <Button variant="contained" size="large" onClick={handleSubmit}>Save</Button>}
                                    <Button variant="contained" size="large" color="secondary" onClick={NewClearData}>New/Clear</Button>
                                </Grid>
                            </Grid>
                        </form>                   
            </Paper>
        </Grid>
        <Grid item xs={12} md={8.5}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} sx={{ width: { xl: '30%', lg: '30%' } }} />
                    <Button variant="contained" size="small" onClick={openCustomModal}>Add Employee Template</Button>
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