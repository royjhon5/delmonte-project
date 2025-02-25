import { Box, Button, FormControl, Grid, InputLabel, ListItem, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { Fragment, useState } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import http from "../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UserListData = () => {
  const queryClient = useQueryClient();
  const { data: userData } = hookContainer('/get-formlist');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [UserName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [fullName, setFullName] = useState('');
  const [descripTion, setDescription] = useState('');
  const [checkedData, setCheckedData] = useState([]);
  const constMappedData = Array.isArray(userData) ? userData.map((row) => {
    return { ...row, id: row.id  };
  }) : [];

  const ColumnHeader = [
    { field: 'form_name', headerName: 'Form name', width: 250,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.form_name}
        </Box>
      ),
     },
    { field: 'form_type', headerName: 'Form type', flex:1, 
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.form_type}
        </Box>
      ),
    },
  ];


  const handleSubmit = async () => {
    const UserRegistrationData = { 
      LoginID: selectedRowData ? selectedRowData.LoginID : 0,
      Username: UserName,
      UserLevel: userLevel, 
      FullName: fullName,
      Description: descripTion,
      form_id: checkedData
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
  })


  const NewClearData = () => {
    setSelectedRowData(null);
    setUserName('');
    setUserLevel('');
    setFullName('');
    setDescription('');
  }

  const handleSelectionChange = (selectionModel) => {
    setCheckedData(selectionModel);
  };

  return (
    <Fragment>
    <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
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
                                    <Button variant="contained" size="large" onClick={handleSubmit} >Save</Button>}
                                    <Button variant="contained" size="large" color="secondary" onClick={NewClearData}>New/Clear</Button>
                                </Grid>
                            </Grid>
                        </form>                   
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: 2, flexDirection: 'row',  }}>
                <Typography>Access Form</Typography>
            </Stack>
            <CustomDataGrid 
                columns={ColumnHeader}
                rows={constMappedData}
                maxHeight={450}
                height={450}
                slots={{ noRowsOverlay: NoData }}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
            />
            </Paper>
        </Grid>
    </Grid>
    </Fragment>
  )
}

export default UserListData