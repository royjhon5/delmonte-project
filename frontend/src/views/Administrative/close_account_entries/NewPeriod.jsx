import { Box, Button, FormControl, FormControlLabel, Grid, Grow, InputAdornment, InputLabel, OutlinedInput, Paper, Switch, TableCell, TablePagination, TableRow, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomTable from '../../../components/CustomDataTable';
import TableHeader from '../../../components/CustomDataTable/TableHeader';
import CustomHeaderCell from '../../../components/CustomDataTable/CustomHeaderCell';
import CustomTableBody from '../../../components/CustomDataTable/TableBody';
import LoadingData from '../../../components/CustomDataTable/LoadingData';
import CustomTableBodyCell from '../../../components/CustomDataTable/CustomTableBodyCell';
import NoData from '../../../components/CustomDataTable/NoData';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { toast } from 'sonner';
import http from '../../../api/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddCompanyDetails from './AddCompanyDetails';
import dayjs from 'dayjs'
import VerifyPeriodStatus from '../../../components/VerifySwal/ActivateAndDeactivate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewHistory from './ViewHistory';

const NewPeriod = () => {
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openCompanyList, setOpenCompanyList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [periodMode, setPeriodMode] = useState(false);
  const [openVerifySwal, setOpenVerifySwal] = useState(false);
  const [viewHistory, setViewHistoty] = useState(false)
  const queryClient = useQueryClient();
  const handleChangeDense = (event) => {setDense(event.target.checked);};
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}
  const openComapnyListModal = () => {setOpenCompanyList(true)}
  const closeComapnyListModal = () => {setOpenCompanyList(false)}
  const openVerifySwalModal = () => {setOpenVerifySwal(true)}
  const closeVerifySwalModal = () => {setOpenVerifySwal(false)}
  const openViewHistory = () => {setViewHistoty(true)}
  const closeViewHistory = () => {setViewHistoty(false)}

  const [selectedID, setSelectedID] = useState(null);
  const [companyID, setCompanyID] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [closingDate, setClosingDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [ToDate, setToDate] = useState(null);

  const getClosingPeriod = async () => {
    setLoading(true)
    try {
      const response = await http.get('/closing-period-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }


  const { data } = useQuery({
    queryKey: ['closing_period'],
    queryFn: getClosingPeriod  
  });


  const saveNewPeriod = () => {
    if (!closingDate || !fromDate || !ToDate || !companyName) {
        return toast.error('Fields should not be empty!');
    }
    const formattedClosingDate = closingDate ? dayjs(closingDate).format('YYYY-MM-DD') : null;
    const formattedFromDate = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null;
    const formattedToDate = ToDate ? dayjs(ToDate).format('YYYY-MM-DD') : null;
      addNewPeriod.mutate({ CPDate: formattedClosingDate, CPFrom: formattedFromDate, CPTo: formattedToDate, CPStatus: 'ACTIVE', CPCompID: companyID , CPCompany: companyName });
  };

  const addNewPeriod = useMutation({
    mutationFn: ({ CPDate, CPFrom, CPTo, CPStatus, CPCompID, CPCompany }) => http.post('/new-period', { CPDate, CPFrom, CPTo, CPStatus, CPCompID, CPCompany }),
        onSuccess: () => {
            toast.success('New Period has been saved.');
            queryClient.invalidateQueries({ queryKey: ['closing_period'] });
            clearData();
        },
        onError: (error) => {
            console.log(error)
        }
  });


  const updateClosingPeriodDetails = () => {
    const formattedClosingDate = closingDate ? dayjs(closingDate).format('YYYY-MM-DD') : null;
    const formattedFromDate = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null;
    const formattedToDate = ToDate ? dayjs(ToDate).format('YYYY-MM-DD') : null;
    updateClosingPeriod.mutate({ id: selectedID, CPDate: formattedClosingDate, CPFrom: formattedFromDate, CPTo: formattedToDate, CPStatus: 'ACTIVE', CPCompID: companyID , CPCompany: companyName });
  };

  const updateClosingPeriod = useMutation({
    mutationFn: ({ id, CPDate, CPFrom, CPTo, CPStatus, CPCompID, CPCompany }) =>
      http.post(`/new-period`, { id, CPDate, CPFrom, CPTo, CPStatus, CPCompID, CPCompany }),
    onSuccess: () => {
      toast.success('Period details has been updated.');
      clearData();
      queryClient.invalidateQueries({ queryKey: ['closing_period'] });
    },
    onError: (error) => {
      if (error.response && error.response.status === 400 && error.response.data.error === "Account number already exists!") {
      toast.error('Account number already exists.');
      } else {
      console.error(error)
      }
    }
  });

  const activateTheStatus = () => {
    updateStatusActivate.mutate({ id: selectedID });
  };

  const updateStatusActivate = useMutation({
    mutationFn: ({ id }) =>
      http.post(`/active-data`, { id }),
    onSuccess: () => {
      toast.info('Period has been activated');
      clearData();
      queryClient.invalidateQueries({ queryKey: ['closing_period'] });
    },
    onError: (error) => {
      console.error(error)
    }
  });


  const deactivateTheStatus = () => {
    updateStatusDeactivate.mutate({ id: selectedID });
  };

  const updateStatusDeactivate = useMutation({
    mutationFn: ({ id }) =>
      http.post(`/deactive-data`, { id }),
    onSuccess: () => {
      toast.info('Period has been De-activated');
      clearData();
      queryClient.invalidateQueries({ queryKey: ['closing_period'] });
    },
    onError: (error) => {
      console.error(error)
    }
  });

  const EditData = (data) => {
    setEditMode(true);
    setSelectedID(data.CPID)
    setCompanyID(data.CPCompID);
    setCompanyName(data.CPCompany);
    setClosingDate(dayjs(data.CPDate));
    setFromDate(dayjs(data.CPFrom));
    setToDate(dayjs(data.CPTo))
  }

  const getcompanyID = (data) => {
    setCompanyID(data)
  }

  const getcompanyName = (data) => {
    setCompanyName(data)
  }

  const clearData = () => {
    setEditMode(false)
    setCompanyID('');
    setCompanyName('');
    setClosingDate(null);
    setFromDate(null);
    setToDate(null);
    closeVerifySwalModal();
  }

  const ActivateStatus = (data) => {
    setPeriodMode(true)
    setSelectedID(data.CPID)
    openVerifySwalModal()
  }

  const CloseStatus = (data) => {
    setPeriodMode(false)
    setSelectedID(data.CPID)
    openVerifySwalModal()
  }

  const clickToViewHistory = (data) => {
    setSelectedID(data.CPID)
    openViewHistory()
  }


  return (
    <>
    <AddCompanyDetails open={openCompanyList} onClose={closeComapnyListModal} companyID={getcompanyID} companyName={getcompanyName} />
    <VerifyPeriodStatus open={openVerifySwal} onClose={closeVerifySwalModal} statusTitle={periodMode ? 
    <Typography color="primary">ACTIVATE</Typography> : <Typography color="error">DE-ACTIVATE</Typography>} 
        YesOnClick={periodMode ? activateTheStatus : deactivateTheStatus}
        NoOnClick={closeVerifySwalModal}
    />
    <ViewHistory open={viewHistory} onClose={closeViewHistory} idLink={selectedID} />
    <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
            <Paper sx={{padding:2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5, mb:1}}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Company</InputLabel>
                  <OutlinedInput 
                      value={companyName} 
                      onChange={(e) => {setCompanyName(e.target.value)}}
                      disabled
                      endAdornment={
                      <InputAdornment position="end">
                          <Button size="small" variant="contained" onClick={openComapnyListModal} ><SearchIcon/></Button>
                      </InputAdornment>
                      }
                  />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker  
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)} 
                    label="Period From"
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                    value={ToDate}
                    onChange={(newValue) => setToDate(newValue)} 
                    label="Period To" 
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                    value={closingDate}
                    onChange={(newValue) => setClosingDate(newValue)} 
                    label="Closing Period"
                    />
                </LocalizationProvider>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', gap: 1,}}>
                    {editMode ? 
                    <Button variant='contained' size="large" onClick={updateClosingPeriodDetails}>Update</Button> :
                    <Button variant='contained' size="large" onClick={saveNewPeriod}>Save</Button>
                    }
                    <Button variant='contained' size="large" sx={{background: '#5C76B7'}} onClick={clearData}>New / Clear</Button>
                </Box>
            </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
            <Paper sx={{paddingTop:2}}> 
            <CustomTable size={dense ? 'small' : 'medium'}>
            <TableHeader>
                <CustomHeaderCell>Period Month</CustomHeaderCell>
                <CustomHeaderCell>Year</CustomHeaderCell>
                <CustomHeaderCell>Status</CustomHeaderCell>
                <CustomHeaderCell>Company</CustomHeaderCell>
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : [];
            return filteredData.length > 0 ? (
                filteredData.map((variable) => (
                <Grow in={true} key={variable.CPID}>
                    <TableRow hover>  
                    <CustomTableBodyCell>{variable.CPMonth}</CustomTableBodyCell>
                    <CustomTableBodyCell>{variable.CPYear}</CustomTableBodyCell>
                    <CustomTableBodyCell>{variable.CPStatus === 'ACTIVE' ? <Typography color="primary">ACTIVE</Typography> : <Typography color="error">CLOSED</Typography> }</CustomTableBodyCell>
                    <CustomTableBodyCell>{variable.CPCompany}</CustomTableBodyCell>
                    <CustomTableBodyCell>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', gap:1}}>
                            <Button variant='contained' size="small" color="secondary" startIcon={<VisibilityIcon fontSize='inherit' />} onClick={() => clickToViewHistory(variable)}>View History</Button>
                            {variable.CPStatus === 'CLOSED' ? <Button variant='contained' size="small" onClick={() => ActivateStatus(variable)} >Activate Period</Button> : <Button variant='contained' size="small" color="error" onClick={() => CloseStatus(variable)}>Close Period</Button>}
                            <Button variant='contained' size="small" onClick={() => EditData(variable)}>Edit</Button>
                        </Box>
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
        </Grid>
    </Grid>
    </>
  )
}

export default NewPeriod