import { Box, Button, Dialog, DialogContent, FormControl, FormControlLabel, Grid, Grow, IconButton, InputAdornment, InputLabel, ListItemText, OutlinedInput, Switch, TableCell, TablePagination, TableRow, TextField, Typography, useTheme } from "@mui/material"
import PropTypes from 'prop-types'
import NoData from "../../../components/CustomDataTable/NoData";
import CustomTableBodyCell from "../../../components/CustomDataTable/CustomTableBodyCell";
import LoadingData from "../../../components/CustomDataTable/LoadingData";
import CustomHeaderCell from "../../../components/CustomDataTable/CustomHeaderCell";
import CustomTable from "../../../components/CustomDataTable";
import TableHeader from "../../../components/CustomDataTable/TableHeader";
import CustomTableBody from "../../../components/CustomDataTable/TableBody";
import { useState } from "react";
import { toast } from "sonner";
import http from "../../../api/http";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from "../../../components/CustomDialog";
import SearchIcon from '@mui/icons-material/Search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import VerifySwal from "../../../components/VerifySwal";
import AddSupplierType from "../../masterfile/supplier_list/AddSupplierType";

const AddPayee = ({open, onClose, VoucherID, VoucherPayee, VoucherAddress, VoucherTIN}) => {
  const theme = useTheme();
  const [dense, setDense] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addSupplier, setAddSupplier] = useState(false);
  const [openDeleteSwal, setopenDeleteSwal] = useState(false);
  const [openSupplierType, setOpenSupplierType] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);


  const [selectedID, setSelectedID] = useState(null);
  const [suppType, setSuppType] = useState('');
  const [suppName, setSuppName] = useState('');
  const [suppDestination, setSuppDestination] = useState('');
  const [suppAddress, setSuppAddress] = useState('');
  const [suppNo, setSuppNo] = useState('');
  const [suppTin, setSuppTin] = useState('');

  const handleChangeDense = (event) => {setDense(event.target.checked);}
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}
  const openAddSupplierModal = () => {setAddSupplier(true)}
  const closeAddSupplierModal = () => {setAddSupplier(false)}
  const confirmDeletion = () => {setopenDeleteSwal(true)}
  const cancelDeletion = () => {setopenDeleteSwal(false), setSelectedID('')}
  const openSupplierTypeModal = () => {setOpenSupplierType(true)}
  const closeSupplierTypeModal = () => {setOpenSupplierType(false)}
  const queryClient = useQueryClient();

  const getData = async () => {
    setLoading(true)
    try {
      const response = await http.get('/supplier-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['getsupplier'],
    queryFn: getData,
  });


  const addNewSupplier = useMutation({
    mutationFn: ({ supp_type, supp_name, supp_designation, supp_address, supp_no, supp_tin }) => http.post('/new-supplier', { supp_type, supp_name, supp_designation, supp_address, supp_no, supp_tin }),
        onSuccess: () => {
            toast.success('New Supplier details has been saved.');
            clearData();
            queryClient.invalidateQueries({ queryKey: ['getsupplier'] });
        },
        onError: (error) => {
            if (error.response && error.response.status === 400 && error.response.data.error === "Supplier name already exists!") {
              toast.error('Supplier name already exists.');
            } else {
              console.error(error)
            }
        }
  });

  const updateSupplier = useMutation({
    mutationFn: ({ id, supp_type, supp_name, supp_designation, supp_address, supp_no, supp_tin }) =>
      http.post(`/update-supplier`, { id, supp_type, supp_name, supp_designation, supp_address, supp_no, supp_tin }),
    onSuccess: () => {
      toast.success('Supplier details has been updated.');
      clearData();
      queryClient.invalidateQueries({ queryKey: ['getsupplier'] });
    },
    onError: (error) => {
      if (error.response && error.response.status === 400 && error.response.data.error === "Account number already exists!") {
      toast.error('Account number already exists.');
      } else {
      console.error(error)
      }
    }
  });

  const updateSupplierDetails = () => {
    updateSupplier.mutate({ id: selectedID, supp_type: suppType, supp_name: suppName, supp_designation: suppDestination, supp_address: suppAddress, supp_no: suppNo, supp_tin: suppTin });
    closeAddSupplierModal();
  };

  const saveNewSupplier = () => {
    if (!suppType || !suppName || !suppDestination || !suppAddress || !suppNo || !suppTin) {
        return toast.error('Field should not be empty!');
      }
      addNewSupplier.mutate({ supp_type: suppType, supp_name: suppName, supp_designation: suppDestination, supp_address: suppAddress, supp_no: suppNo, supp_tin: suppTin });
  };

  const deleteSupplier = useMutation({
    mutationFn: (id) => http.delete('/delete-supplier', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['getsupplier'] });
    }
  });
  
  const deleteData = () => {
    deleteSupplier.mutate(selectedID);
    cancelDeletion();
  };

  const handleEdit = (data) => {
    setEditMode(true);
    setSelectedID(data.SID);
    setSuppType(data.SuppType);
    setSuppName(data.SuppName);
    setSuppDestination(data.SuppDesignation);
    setSuppAddress(data.SupplierAddress);
    setSuppNo(data.SuppContactNo);
    setSuppTin(data.TIN);
    openAddSupplierModal();
  };

  const clearData = () => {
    setSelectedID(null);
    setSuppType('');
    setSuppName('');
    setSuppDestination('');
    setSuppAddress('');
    setSuppNo('');
    setSuppTin('');
  }

  const handleDelete = (data) => {
    setSelectedID(data.SID);
    confirmDeletion();
  }


  const SelectData = (data) => {
    VoucherID(data.SID)
    VoucherPayee(data.SuppName);
    VoucherAddress(data.SupplierAddress);
    VoucherTIN(data.TIN)
    onClose();
  };

  const suppTypes = (data) => {
    setSuppType(data)
  };

  const CloseDialog = () => {
    onClose();
    setPage(0);
  }


  return (
    <>
    <AddSupplierType open={openSupplierType} onClose={closeSupplierTypeModal} suppType={suppTypes} />
    <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={cancelDeletion} YesOnClick={deleteData} NoOnClick={cancelDeletion} />
     <CustomDialog 
        open={addSupplier}
        onClose={closeAddSupplierModal}
        DialogTitles={editMode ? "Update Supplier Details" : "Add New Supplier"}
        DialogContents={
            <Box sx={{mt:1}}>
            <FormControl variant="outlined" fullWidth>
                  <InputLabel>Type</InputLabel>
                  <OutlinedInput  
                      value={suppType}
                      size="large"
                      disabled
                      onChange={(e) => {setSuppType(e.target.value)}}
                      endAdornment={
                      <InputAdornment position="end">
                          <Button size="large" variant="contained" onClick={openSupplierTypeModal}><SearchIcon/></Button>
                      </InputAdornment>
                      }
                  />
            </FormControl>
            <TextField label=" Full name / Supplier Name" value={suppName} onChange={(e) => {setSuppName(e.target.value)}} fullWidth sx={{ mt:1}}  />
            <TextField label="Designation" value={suppDestination} onChange={(e) => {setSuppDestination(e.target.value)}} fullWidth sx={{ mt:1}}  />
            <TextField label="Address" value={suppAddress} onChange={(e) => {setSuppAddress(e.target.value)}} fullWidth sx={{ mt:1}}  />
            <TextField label="Contact Number" value={suppNo} onChange={(e) => {setSuppNo(e.target.value)}} fullWidth sx={{ mt:1}}  />
            <TextField label="TIN" value={suppTin} onChange={(e) => {setSuppTin(e.target.value)}} fullWidth sx={{ mt:1}}  />
            </Box>
        }
        DialogAction={
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {editMode ? (
                    <Button variant="contained" onClick={updateSupplierDetails}>Update</Button>
                ) : (          
                    <Button variant="contained" onClick={saveNewSupplier}>Save</Button>
                )}
                <Button variant="contained" color="error" onClick={closeAddSupplierModal}>Cancel</Button>
            </Box>
        }
        />
    <Dialog
    maxWidth="xl"
    fullWidth={true}
    onClose={CloseDialog} 
    open={open} 
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
        <DialogContent sx={{padding:0}}>
        <Grid container sx={{mb:1, padding:2}} spacing={1}>
            <Grid item xs={12} md={5} >
                <TextField label="Search" fullWidth size="medium" onChange={(e) => {setSearch(e.target.value)}} />
            </Grid>
            <Grid item xs={12} md={2} sx={{display: 'flex', alignItems:'center'}}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={openAddSupplierModal}>Add Payee</Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{display: 'flex', justifyContent:'flex-end', alignItems: 'center'}}>
                <Button color="error" variant="contained" onClick={CloseDialog}>Close</Button>
            </Grid>
        </Grid>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell width="10%">Supplier</CustomHeaderCell>
            <CustomHeaderCell width="10%">Designation</CustomHeaderCell>
            <CustomHeaderCell width="10%">Contact Number</CustomHeaderCell>
            <CustomHeaderCell width="10%">TIN</CustomHeaderCell>
            <CustomHeaderCell></CustomHeaderCell>
        </TableHeader>
        <CustomTableBody>
            {loading? (
                <>
                  <Grow in={true}>
                    <TableRow>
                      <TableCell colSpan={12}>
                        <LoadingData />
                      </TableCell>
                    </TableRow>
                  </Grow>
                </>
            ) : (
              <>
      {(() => {
        const filteredData = Array.isArray(data) 
          ? data
              .filter((reqs) => search.toLowerCase() === '' || reqs.SuppName.toLowerCase().includes(search.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : [];
          return filteredData.length > 0 ? (
            filteredData.map((variable) => (
              <Grow in={true} key={variable.SID}>
                <TableRow hover>  
                  <CustomTableBodyCell width="20%">
                    <ListItemText>
                        {variable.SuppName}
                      <Typography sx={{ color: 'rgb(99, 115, 129)' }} variant="body2">
                        {variable.SupplierAddress}
                      </Typography>
                    </ListItemText>
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                    {variable.SuppDesignation}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                    {variable.SuppContactNo}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                    {variable.TIN}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right" width="10%">
                        <Button size="small" variant="contained" onClick={() => SelectData(variable)}>Select</Button>
                        <IconButton size="small" onClick={() => handleEdit(variable)} color="primary"><EditIcon fontSize="inherit" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(variable)} color="error"><DeleteIcon fontSize="inherit" /></IconButton>
                  </CustomTableBodyCell>
                </TableRow>
              </Grow>
            ))
          ) : (
            <Grow in={true}>
              <TableRow>
                <TableCell sx={{ border: 'none' }} colSpan={12}>
                  <NoData />
                </TableCell>
              </TableRow>
            </Grow>
          );
        })()}
      </>
            )}
        </CustomTableBody>
        </CustomTable>       
        <Box sx={{ padding: 1, display: 'flex', justifyContent: 'space-between'}}>
          <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense"
          />
          <TablePagination 
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data ? data.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        </DialogContent>
    </Dialog>
    </>
  )
}
AddPayee.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    VoucherID: PropTypes.func,
    VoucherPayee: PropTypes.func,
    VoucherAddress: PropTypes.func,
    VoucherTIN: PropTypes.func,
}

export default AddPayee