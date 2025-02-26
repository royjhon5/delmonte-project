import { Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import { Fragment, useState } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ViewUserList = () => {
  const queryClient = useQueryClient();
  const { data: userData } = hookContainer('/get-formlist');
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState(null);
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



  const navigteToUserList = () => { navigate('/dashboard/user-list') }

  return (
    <Fragment>
    <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <Paper >
              <Box sx={{padding: 2}}>
                <TextField size="small" label="Search user" />
              </Box>
              <CustomDataGrid 
                columns={ColumnHeader}
                rows={constMappedData}
                maxHeight={450}
                height={450}
                slots={{ noRowsOverlay: NoData }}
            />                    
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <Paper>
            <Stack sx={{ display: 'flex', padding: 2, flexDirection: 'row', justifyContent: 'space-between'  }}>
                <Typography sx={{display: 'flex', justifyContent:'center', alignItems:'center'}} color="primary">User List</Typography>
                <Button onClick={navigteToUserList} startIcon={<GroupIcon />} variant="contained">Add New</Button>
            </Stack>
            <CustomDataGrid 
                columns={ColumnHeader}
                rows={constMappedData}
                maxHeight={450}
                height={450}
                slots={{ noRowsOverlay: NoData }}
                checkboxSelection
            />
            </Paper>
        </Grid>
    </Grid>
    </Fragment>
  )
}

export default ViewUserList