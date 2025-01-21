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

const JournalData = () => {
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialogBox, setOpen] = useState(false);

  const [selectedID, setSelectedID] = useState(null);
  const [description, setDescription] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [openDeleteSwal, setopenDeleteSwal] = useState(false)
  const openDialog = () => {setOpen(true)}
  const closeDialog = () => {setOpen(false),setEditMode(false), clearData()}
  const confirmDeletion = () => {setopenDeleteSwal(true)}
  const cancelDeletion = () => {setopenDeleteSwal(false), setSelectedID('')}
  const handleChangeDense = (event) => {setDense(event.target.checked);};
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}
  const queryClient = useQueryClient();


 const getJournalList = async () => {
    setLoading(true)
    try {
      const response = await http.get('/journal-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['journal'],
    queryFn: getJournalList  
  });

  const addNewJournal = useMutation({
    mutationFn: ({ description }) => http.post('/new-journal', { description }),
        onSuccess: () => {
            toast.success('New Data has been saved.');
            setDescription('');
            queryClient.invalidateQueries({ queryKey: ['journal'] });
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
    if (!description) {
        return toast.error('Field should not be empty!');
      }
      addNewJournal.mutate({ description: description });
  };

  const updateJournal = useMutation({
    mutationFn: ({ id, description }) =>
      http.post(`/new-journal`, { id, description }),
    onSuccess: () => {
      toast.success('Journal details has been updated.');
      setDescription('');
      setSelectedID(null);
      queryClient.invalidateQueries({ queryKey: ['journal'] });
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
    updateJournal.mutate({ id: selectedID, description: description });
    closeDialog();
  };

  

  const deleteJournalData = useMutation({
    mutationFn: (id) => http.delete('/delete-journal', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    }
  });
  
  const DeleteData = () => {
    deleteJournalData.mutate(selectedID);
    cancelDeletion();
  };

  const handleEdit = (cashflow) => {
    setEditMode(true);
    setSelectedID(cashflow.CNNo);
    setDescription(cashflow.Description);
    openDialog();
  };

  const clearData = () => {
    setSelectedID(null);
    setDescription('');
  }

  const handleDelete = (cashflow) => {
    setSelectedID(cashflow.CNNo);
    confirmDeletion();
  }

  return (
    <Paper>
        <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={cancelDeletion} YesOnClick={DeleteData} NoOnClick={cancelDeletion} />
        <CustomDialog 
        open={openDialogBox}
        onClose={closeDialog}
        DialogTitles={editMode ? "Update Journal Details" : "Add New Journal"}
        DialogContents={
            <TextField label="Description" value={description} onChange={(e) => {setDescription(e.target.value)}} fullWidth sx={{ mt:1}}  />
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
                Add Journal
            </Button>
        </Stack>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell>Journal Book</CustomHeaderCell>
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
              .filter((reqs) => search.toLowerCase() === '' || reqs.Description.toLowerCase().includes(search.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : [];
          return filteredData.length > 0 ? (
            filteredData.map((variable) => (
              <Grow in={true} key={variable.CNNo}>
                <TableRow hover>  
                  <CustomTableBodyCell>{variable.Description}</CustomTableBodyCell>
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

export default JournalData