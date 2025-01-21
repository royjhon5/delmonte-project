import { Box, Button, Dialog, DialogContent, FormControl, Grid, IconButton, InputAdornment, InputLabel, ListItemText, OutlinedInput, Typography, useTheme } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { IS_CHECKPAYEE, OPEN_ADDPAYEE, OPEN_DELETESWAL, OPEN_SAVENEWPAYEE, OPEN_TOUPDATEPAYEE, PASS_SUPPLIERDETAILS } from "../../../store/actions";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { useState } from "react";
import { useGetPayee } from "../../../hooks/globalQuery";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddUpdatePayeeModal from "./_AddUpdatePayeeModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import { toast } from "sonner";
import http from "../../../api/http";
import PropTypes from 'prop-types';
const AddPayee = ({objData}) => {
  const theme = useTheme();
  const open = useSelector((state) => state.customization.openAddPayee);
  const VerifyIfCheckPayee = useSelector((state) => state.customization.isCheckPayee);
  const dispatch = useDispatch();
  const openAddUpdatePayee = () => {dispatch({ type: OPEN_SAVENEWPAYEE, openSaveNewPayee: true })};
  const CloseDialog = () => {dispatch({ type: OPEN_ADDPAYEE, openAddPayee: false }), dispatch({ type: IS_CHECKPAYEE, isCheckPayee: false }), setSearch('')}
  const queryClient = useQueryClient();
  const [selectedID, setSelectedID] = useState(0);
  const [search, setSearch] = useState('');
  const { data, loading } = useGetPayee(); 

  
  const constMappedData = Array.isArray(data) ? data.map((row) => {
    return { ...row, id: row.SID };
  }) : [];
 
  const SearchFilter = (rows) => {
    return rows.filter(row =>
        row.SuppName.toLowerCase().includes(search.toLowerCase()) || 
        row.SuppDesignation.toLowerCase().includes(search.toLowerCase())
    );
  };

  const refreshData = () => {
    queryClient.invalidateQueries(['payeeType']);
  };

  const DeleteSelectedData = () => {
    DeleteSelectedSupplier.mutate(selectedID);
  };

  const DeleteSelectedSupplier = useMutation({
    mutationFn: (id) => http.delete('/delete-supplier', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      dispatch({ type: OPEN_DELETESWAL, confirmDelete: false });
      refreshData();
    }
  });
  
  

  

  const ColumnHeader = [
    { field: 'SuppName', headerName: 'Supplier', width: 450, 
      renderCell: (params) => (
        <ListItemText>
            {params.row.SuppName}
          <Typography sx={{ color: 'rgb(99, 115, 129)' }} variant="body2">
            {params.row.SupplierAddress}
          </Typography>
        </ListItemText>
      ),
    },
    { field: 'SuppDesignation', headerName: 'Designation', flex: 1, },
    { field: 'SuppContactNo', headerName: 'Contact #', flex: 1, },
    { field: 'TIN', headerName: 'TIN', flex: 1, },
    { field: "actions", headerAlign: '',
      headerName: '',    
      flex: 1,
      align: 'right',
      renderCell: (data) => {
      const SelectData = () => {
        const obj = {
          id: data.row.SID,
          name: data.row.SuppName,
          tin: data.row.TIN,
          address: data.row.SupplierAddress,
        }
        objData(obj);
        dispatch({ type: OPEN_ADDPAYEE, openAddPayee: false })
      }
      const SelectSpecific = () => {
        const obj = {
          name: data.row.SuppName,
        }
        objData(obj)
        dispatch({ type: OPEN_ADDPAYEE, openAddPayee: false });
        dispatch({ type: IS_CHECKPAYEE, isCheckPayee: false })
      }
      const ToEditData = () => {
        const obj = {
          id: data.row.SID,
          type: data.row.SuppType,
          name: data.row.SuppName,
          designation: data.row.SuppDesignation,
          address: data.row.SupplierAddress,
          number: data.row.SuppContactNo,
          tin: data.row.TIN,
        }
        dispatch({ type: PASS_SUPPLIERDETAILS, supplierData: obj });
        dispatch({ type: OPEN_SAVENEWPAYEE, openSaveNewPayee: true });
        dispatch({ type: OPEN_TOUPDATEPAYEE, toUpdatePayee: true }); 
      }
      const ToDeleteData = () => {
        setSelectedID(data.row.SID);
        dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });       
      }
      return (
        <Box sx={{display: 'flex', flexDirection:'row', gap:.5, marginTop: 1.5, justifyContent:'flex-end'}}>
          <Button variant="contained" color="primary" size="small" onClick={VerifyIfCheckPayee ? SelectSpecific : SelectData}>Select</Button>
          <IconButton size="small">
              <EditIcon fontSize="inherit" color="primary" onClick={ToEditData} />
          </IconButton>
          <IconButton size="small">
              <DeleteIcon fontSize="inherit" color="error" onClick={ToDeleteData} />
          </IconButton>  
        </Box>
      )
      }
    }
  ];

  return (
    <>
    <AddUpdatePayeeModal RefreshData={refreshData} />
    <DeleteSwal maxWidth="xs" onClick={DeleteSelectedData} />
    <Dialog
    open={open}
    onClose={CloseDialog}
    maxWidth="lg"
    fullWidth={true} 
    BackdropProps={{
        sx: {
          backgroundColor: 'rgba(22, 28, 36, 0.8)',
        }
    }}
    sx={{
        overflowY: 'auto',
        boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px'
    }}
    >
        <DialogContent sx={{padding:0, overflow: 'hidden'}}>
        <Grid container sx={{mb:1, padding:2}} spacing={1}>
            <Grid item xs={12} md={6} >
            <FormControl variant="outlined" fullWidth>
                  <InputLabel>Search</InputLabel>
                  <OutlinedInput  
                      value={search}
                      onChange={(e) => {setSearch(e.target.value)}}
                      size="medium"
                      endAdornment={
                      <InputAdornment position="end">
                          <Button size="small" variant="contained" onClick={openAddUpdatePayee}><AddIcon/> Add Payee</Button>
                      </InputAdornment>
                      }
                    label="Search"
                  />
            </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', justifyContent:'flex-end', alignItems: 'center'}}>
            <IconButton size="small" color="error" onClick={CloseDialog}><CloseIcon fontSize="small" /></IconButton>
            </Grid>
        </Grid>
        <CustomDataGrid 
          columns={ColumnHeader}
          maxHeight={450}
          height={450}
          rows={SearchFilter(constMappedData)}
          slots={{ noRowsOverlay: NoData }}
          loading={loading}
        />
        </DialogContent>
    </Dialog>
    </>
  )
}

AddPayee.propTypes = {
  objData: PropTypes.func,
}

export default AddPayee