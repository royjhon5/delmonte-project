import { Box, Button, FormControl, Grid, IconButton, InputLabel, ListItem, MenuItem, Paper, Select, Stack, TextField } from "@mui/material"
import { Fragment, useState } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hookContainer } from "../../../hooks/globalQuery";
import http from "../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPEN_DELETESWAL } from "../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../components/Swal/DeleteSwal";

const UserListData = () => {
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
    { field: 'Username', headerName: 'Username', width: 250,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.Username}
        </Box>
      ),
     },
    { field: 'UserLevel', headerName: 'User Level', flex:1, },
    { field: 'FullName', headerName: 'Full Name', flex:1, },
    { field: 'Description', headerName: 'Description', flex:1, },
    { field: "action", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (params) => {   
        const SelectedRow = () => {
          setSelectedRowData(params.row);
          setUserName(params.row.Username);
          setUserLevel(params.row.UserLevel);
          setFullName(params.row.FullName);
          setDescription(params.row.Description);

        }
      return (
        <Box sx={{paddingRight:1}}>
          <IconButton color="primary" size="small" onClick={SelectedRow}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => selectToDelete(params.row.LoginID)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )
      }
    }
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

  return (
    <Fragment>
      <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
            <Paper sx={{padding: 2}}>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                  <TextField
                                      fullWidth
                                      label="Username"
                                      variant="outlined"
                                      value={UserName}
                                      onChange={(e) => {setUserName(e.target.value)}}
                                      size="medium"
                                  />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <InputLabel>User Level</InputLabel>
                                    <Select
                                        label="User Level"
                                        variant="outlined"
                                        value={userLevel}
                                        onChange={(e) => {setUserLevel(e.target.value)}}
                                        size="medium"
                                    >
                                            <MenuItem value={"Schema Admin"}>
                                                <ListItem>Schema Admin</ListItem>
                                            </MenuItem>
                                            <MenuItem value={"Admin"}>
                                                <ListItem>Admin</ListItem>
                                            </MenuItem>
                                            <MenuItem  value={"Mere User"}>
                                                <ListItem>Mere User</ListItem>
                                            </MenuItem>
                                            <MenuItem  value={"COA User"}>
                                                <ListItem>COA User</ListItem>
                                            </MenuItem>
                                    </Select>
                                </FormControl>  
                                </Grid>
                                <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Full name"
                                    variant="outlined"
                                    value={fullName}
                                    onChange={(e) => {setFullName(e.target.value)}}
                                    size="medium"
                                />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    type="description" 
                                    value={descripTion}
                                    name="description"
                                    onChange={(e) => {setDescription(e.target.value)}}
                                    size="medium"
                                />
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
        <Grid item xs={12} md={9}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TextField variant='outlined' value={search} onChange={(e) => {setSearch(e.target.value)}} label="Search" size='medium'  sx={{ width: { xl: '30%', lg: '30%' }}} />
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

export default UserListData