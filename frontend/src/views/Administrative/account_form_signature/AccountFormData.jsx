import { Box, Paper, Stack, TableCell, TablePagination, TableRow, TextField, FormControlLabel, Switch, Grow, Button, IconButton, Grid } from '@mui/material'
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

const AccountFormData = () => {
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDialogBox, setOpen] = useState(false);

  const [selectedID, setSelectedID] = useState(null);
  const [formDocument, setFormDocument] = useState('');
  const [checkBy, setCheckBy] = useState('');
  const [checkByPos, setCheckByPos] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [verifiedByPos, setVerifiedByPos] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [approvedByPos, setApprovedByPos] = useState('');
  const [notedBy, setNotedBy] = useState('');
  const [notedByPos, setNotedByPos] = useState('');
  const [recommendedBy, setRecommendedBy] = useState('');
  const [recommendedByPos, setRecommendedByPos] = useState('');
  const [auditedBy, setAuditedBy] = useState('');
  const [auditedByPos, setAuditedByPos] = useState('');


  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [openDeleteSwal, setopenDeleteSwal] = useState(false)
  const openDialog = () => {setOpen(true)}
  const closeDialog = () => {setOpen(false),setEditMode(false)}
  const confirmDeletion = () => {setopenDeleteSwal(true)}
  const cancelDeletion = () => {setopenDeleteSwal(false), setSelectedID('')}
  const handleChangeDense = (event) => {setDense(event.target.checked);};
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}
  const queryClient = useQueryClient();


 const getFormSignatory = async () => {
    setLoading(true)
    try {
      const response = await http.get('/formsignatory-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['formsignatory'],
    queryFn: getFormSignatory  
  });

  const addNewFormSignatory = useMutation({
    mutationFn: ({ doc_name, checkby, checkby_pos, approvedby, approvedby_pos, recievedby_pos, receivedby, notedby, notedby_pos, auditedby, auditedby_pos, recommendedby, recommendedby_pos }) => http.post('/new-formsignatory', { doc_name, checkby, checkby_pos, approvedby, approvedby_pos, recievedby_pos, receivedby, notedby, notedby_pos, auditedby, auditedby_pos, recommendedby, recommendedby_pos }),
        onSuccess: () => {
            toast.success('New Data has been saved.');
            queryClient.invalidateQueries({ queryKey: ['formsignatory'] });
            ClearData();
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
    addNewFormSignatory.mutate({ doc_name: formDocument, checkby: checkBy, checkby_pos: checkByPos, approvedby: approvedBy, approvedby_pos: approvedByPos, recievedby_pos: verifiedByPos, receivedby: verifiedBy, notedby: notedBy, notedby_pos: notedByPos, auditedby: auditedBy, auditedby_pos: auditedByPos, recommendedby: recommendedBy, recommendedby_pos: recommendedByPos });
  };

  const updateFormSignatory = useMutation({
    mutationFn: ({ id, doc_name, checkby, checkby_pos, approvedby, approvedby_pos, recievedby_pos, receivedby, notedby, notedby_pos, auditedby, auditedby_pos, recommendedby, recommendedby_pos }) =>
      http.post(`/new-formsignatory`, { id, doc_name, checkby, checkby_pos, approvedby, approvedby_pos, recievedby_pos, receivedby, notedby, notedby_pos, auditedby, auditedby_pos, recommendedby, recommendedby_pos }),
    onSuccess: () => {
      toast.success('Form Signatory details has been updated.');
      setSelectedID(null);
      ClearData();
      queryClient.invalidateQueries({ queryKey: ['formsignatory'] });
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
    updateFormSignatory.mutate({ id: selectedID, doc_name: formDocument, checkby: checkBy, checkby_pos: checkByPos, approvedby: approvedBy, approvedby_pos: approvedByPos, recievedby_pos: verifiedByPos, receivedby: verifiedBy, notedby: notedBy, notedby_pos: notedByPos, auditedby: auditedBy, auditedby_pos: auditedByPos, recommendedby: recommendedBy, recommendedby_pos: recommendedByPos });
    closeDialog();
  };

  const deletSignatory = useMutation({
    mutationFn: (id) => http.delete('/delete-formsignatory', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['formsignatory'] });
    }
  });
  
  const DeleteData = () => {
    deletSignatory.mutate(selectedID);
    cancelDeletion();
  };

  const handleEdit = (data) => {
    setEditMode(true);
    setSelectedID(data.ID);
    setFormDocument(data.DocName);
    setCheckBy(data.CheckedBy);
    setCheckByPos(data.CheckedByPos);
    setVerifiedBy(data.ReceivedBy);
    setVerifiedByPos(data.ReceivedByPos);
    setApprovedBy(data.ApprovedBy);
    setApprovedByPos(data.ApprovedByPos);
    setNotedBy(data.NotedBy);
    setNotedByPos(data.NotedByPos);
    setRecommendedBy(data.RecommendedBy);
    setRecommendedByPos(data.RecommendedByPos);
    setAuditedBy(data.AuditedBy);
    setAuditedByPos(data.AuditedByPos);
    openDialog();
  };


  const handleDelete = (data) => {
    setSelectedID(data.ID);
    confirmDeletion();
  };

  const ClearData = () => {
    setFormDocument('');
    setCheckBy('');
    setCheckByPos('');
    setVerifiedBy('');
    setVerifiedByPos('');
    setApprovedBy('');
    setApprovedByPos('');
    setNotedBy('');
    setNotedByPos('');
    setRecommendedBy('');
    setRecommendedByPos('');
    setAuditedBy('');
    setAuditedByPos('');
  }

  return (
    <Paper>
        <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={cancelDeletion} YesOnClick={DeleteData} NoOnClick={cancelDeletion} />
        <CustomDialog 
        maxWidth="md"
        open={openDialogBox}
        onClose={closeDialog}
        DialogTitles={editMode ? "Update Form Signatory Details" : "Add New Form Signatory"}
        DialogContents={
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <TextField label="Form / Document Name" value={formDocument} onChange={(e) => {setFormDocument(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                {/* checked by */}
                <Grid item xs={12} md={6}>
                    <TextField label="Checked By" value={checkBy} onChange={(e) => {setCheckBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={checkByPos} onChange={(e) => {setCheckByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>

                {/* verified by */}

                <Grid item xs={12} md={6}>
                    <TextField label="Verified By" value={verifiedBy} onChange={(e) => {setVerifiedBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={verifiedByPos} onChange={(e) => {setVerifiedByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>

                {/* approved by */}

                <Grid item xs={12} md={6}>
                    <TextField label="Approved By" value={approvedBy} onChange={(e) => {setApprovedBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={approvedByPos} onChange={(e) => {setApprovedByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>

                {/* noted by */}
                <Grid item xs={12} md={6}>
                    <TextField label="Noted By" value={notedBy} onChange={(e) => {setNotedBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={notedByPos} onChange={(e) => {setNotedByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>


                {/* recommended by */}
                <Grid item xs={12} md={6}>
                    <TextField label="Recommended By" value={recommendedBy} onChange={(e) => {setRecommendedBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={recommendedByPos} onChange={(e) => {setRecommendedByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>

                {/* audited by */}
                <Grid item xs={12} md={6}>
                    <TextField label="Audited By" value={auditedBy} onChange={(e) => {setAuditedBy(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="Position / Designation" value={auditedByPos} onChange={(e) => {setAuditedByPos(e.target.value)}} fullWidth sx={{ mt:1}}  />
                </Grid>
            </Grid>
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
                Add Form Signatories
            </Button>
        </Stack>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell>Document</CustomHeaderCell>
            <CustomHeaderCell>Verified By</CustomHeaderCell>
            <CustomHeaderCell>Checked By</CustomHeaderCell>
            <CustomHeaderCell>Approved By</CustomHeaderCell>
            <CustomHeaderCell>Noted By</CustomHeaderCell>
            <CustomHeaderCell>Recommended By</CustomHeaderCell>
            <CustomHeaderCell>Audited By</CustomHeaderCell>
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
              .filter((reqs) => search.toLowerCase() === '' || reqs.DocName.toLowerCase().includes(search.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : [];
          return filteredData.length > 0 ? (
            filteredData.map((variable) => (
              <Grow in={true} key={variable.SigID}>
                <TableRow hover>  
                  <CustomTableBodyCell>{variable.DocName}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.ReceivedBy}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.CheckedBy}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.ApprovedBy}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.NotedBy}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.RecommendedBy}</CustomTableBodyCell>
                  <CustomTableBodyCell>{variable.AuditedBy}</CustomTableBodyCell>
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

export default AccountFormData