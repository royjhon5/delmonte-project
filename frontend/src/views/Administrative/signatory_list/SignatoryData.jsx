import { Box, Paper, Stack, TableCell, TablePagination, TableRow, TextField, FormControlLabel, Switch, Grow, Button, IconButton } from '@mui/material'
import CustomTable from '../../../components/CustomDataTable';
import TableHeader from '../../../components/CustomDataTable/TableHeader';
import CustomHeaderCell from '../../../components/CustomDataTable/CustomHeaderCell';
import CustomTableBody from '../../../components/CustomDataTable/TableBody';
import NoData from '../../../components/CustomDataTable/NoData';
import { useState } from 'react';
import { toast } from 'sonner'
import http from '../../../api/http';
import LoadingData from '../../../components/CustomDataTable/LoadingData';
import CustomTableBodyCell from '../../../components/CustomDataTable/CustomTableBodyCell';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from '../../../components/CustomDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VerifySwal from '../../../components/VerifySwal';

const SignatoryData = () => {
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialogBox, setOpen] = useState(false);

  const [selectedID, setSelectedID] = useState(null);
  const [signatory, setSignatory] = useState('');
  const [designation, setDesignation] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [openDeleteSwal, setopenDeleteSwal] = useState(false)
  const openDialog = () => {setOpen(true)}
  const closeDialog = () => {setOpen(false),setEditMode(false), setSignatory(''), setDesignation('')}
  const confirmDeletion = () => {setopenDeleteSwal(true)}
  const cancelDeletion = () => {setopenDeleteSwal(false), setSelectedID('')}
  const handleChangeDense = (event) => {setDense(event.target.checked);};
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}
  const queryClient = useQueryClient();


 const getSignatoryList = async () => {
    setLoading(true)
    try {
      const response = await http.get('/signatory-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['signatory'],
    queryFn: getSignatoryList  
  });

  const addNewSignatory = useMutation({
    mutationFn: ({ signatory, designation }) => http.post('/new-signatory', { signatory, designation }),
        onSuccess: () => {
            toast.success('New Data has been saved.');
            setSignatory('');
            setDesignation('');
            queryClient.invalidateQueries({ queryKey: ['signatory'] });
        },
        onError: (error) => {
            if (error.response && error.response.data) {
              const errorMessage = error.response.data.error;
              if (errorMessage === 'Nothing has changed on the record.') {
                  toast.info(errorMessage); 
              } else if (errorMessage === 'Data already exists in the record.') {
                  toast.error(errorMessage);
              }
            } else {
              toast.error('An unexpected error occurred.');
            }
        }
  });

  const saveData = () => {
    if (!signatory || !designation) {
        return toast.error('Field should not be empty!');
      }
      addNewSignatory.mutate({ signatory: signatory, designation: designation });
  };

  const updateSignatory = useMutation({
    mutationFn: ({ id, signatory, designation }) =>
      http.post(`/new-signatory`, { id, signatory, designation }),
    onSuccess: () => {
      toast.success('Signatory details has been updated.');
      setSignatory('');
      setDesignation('');
      setSelectedID(null);
      queryClient.invalidateQueries({ queryKey: ['signatory'] });
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error;
        if (errorMessage === 'Nothing has changed on the record.') {
            toast.info(errorMessage); 
        } else if (errorMessage === 'Data already exists in the record.') {
            toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  });

  const updateData = () => {
    updateSignatory.mutate({ id: selectedID, signatory: signatory, designation: designation });
    closeDialog();
  };

  

  const deletSignatory = useMutation({
    mutationFn: (id) => http.delete('/delete-signatory', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['signatory'] });
    }
  });
  
  const DeleteData = () => {
    deletSignatory.mutate(selectedID);
    cancelDeletion();
  };

  const handleEdit = (data) => {
    setEditMode(true);
    setSelectedID(data.SigID);
    setSignatory(data.Signature);
    setDesignation(data.Designation)
    openDialog();
  };


  const handleDelete = (data) => {
    setSelectedID(data.SigID);
    confirmDeletion();
  }

  return (
    <Paper>
        <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={cancelDeletion} YesOnClick={DeleteData} NoOnClick={cancelDeletion} />
        <CustomDialog 
        open={openDialogBox}
        onClose={closeDialog}
        DialogTitles={editMode ? "Update Signatory Details" : "Add New Signatory"}
        DialogContents={
            <>
            <TextField label="Signatory Name" value={signatory} onChange={(e) => {setSignatory(e.target.value)}} fullWidth sx={{ mt:1}}  />
            <TextField label="Designation" value={designation} onChange={(e) => {setDesignation(e.target.value)}} fullWidth sx={{ mt:1}}  />
            </>
        }
        DialogAction={
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {editMode ? (
                    <Button variant="contained" onClick={updateData}>Update</Button>
                ) : (          
                    <Button variant="contained" onClick={saveData}>Save</Button>
                )}
                <Button variant="contained" color="error" onClick={closeDialog}>Cancel</Button>
            </Box>
        }
        />
        <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextField variant='outlined' onChange={(e) => {setSearch(e.target.value)}} label="Search" size='medium' sx={{ width: { xl: '50%', lg: '50%' }}} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={openDialog}>
                Add Signatory
            </Button>
        </Stack>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell>Signatory Name</CustomHeaderCell>
            <CustomHeaderCell>Designation</CustomHeaderCell>
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
              .filter((reqs) => search.toLowerCase() === '' || reqs.Signature.toLowerCase().includes(search.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : [];
          return filteredData.length > 0 ? (
            filteredData.map((variable) => (
              <Grow in={true} key={variable.SigID}>
                <TableRow hover>  
                  <CustomTableBodyCell>{variable.Signature}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.Designation}</CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right">
                    <IconButton sx={{mr:1}} size="medium" onClick={() => handleEdit(variable)} color="primary"><EditIcon fontSize="inherit" /></IconButton>
                    <IconButton size="medium" onClick={() => handleDelete(variable)} color="error"><DeleteIcon fontSize="inherit" /></IconButton>
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
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between'}}>
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
    </Paper>
  )
}

export default SignatoryData