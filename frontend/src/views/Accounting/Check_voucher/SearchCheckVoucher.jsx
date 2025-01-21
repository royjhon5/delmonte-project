import { useState } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Grow, IconButton, Stack, Switch, TableCell, TablePagination, TableRow, TextField, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import CustomTable from '../../../components/CustomDataTable';
import TableHeader from '../../../components/CustomDataTable/TableHeader';
import CustomHeaderCell from '../../../components/CustomDataTable/CustomHeaderCell';
import http from '../../../api/http';
import { toast } from 'sonner';
import CustomTableBodyCell from '../../../components/CustomDataTable/CustomTableBodyCell';
import NoData from '../../../components/CustomDataTable/NoData';
import LoadingData from '../../../components/CustomDataTable/LoadingData';
import CustomTableBody from '../../../components/CustomDataTable/TableBody';
import dayjs from 'dayjs';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckIcon from '@mui/icons-material/Check';


const SearchCheckVoucher = ({ open, onClose, selectedData }) => {
  const theme = useTheme();
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [payeeName, setPayeeName] = useState('');
  const [seriesNo, setSeriesNo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [data, setData] = useState([]);

  const handleChangeDense = (event) => {setDense(event.target.checked);}
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}

  const GenerateResults = async () => {
    setLoading(true);
    try {
      const response = await http.get('/search-checkvoucher', {
        params: {
          PayeeName: payeeName,
          SeriesNo: seriesNo,
          dateFrom,
          dateTo,
        },
      });
      setData(response.data)
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    } finally {
      setLoading(false);
    }
  };
  

  const SelectData = (data) => {
    selectedData(data);
    setData([]);
    onClose();
  };

  const closeModal = () => {
    onClose()
    setPage(0);
  }

  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        onClose={onClose}
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
        <DialogTitle>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h4'>Search Check Voucher</Typography>
                <IconButton color="error" variant="contained" size='small' onClick={closeModal}><CloseIcon fontSize='small' /></IconButton>
            </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mt:1, mb: 1, paddingLeft:3, paddingRight: 3}}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={12}>
              <TextField variant="outlined" label="Search Payee" size='small'  value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField variant="outlined" label="Search CV Number" size='small'  value={seriesNo} onChange={(e) => setSeriesNo(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={8} sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap:1}}>
              <TextField variant="outlined" label="From" type="date" size='small' InputLabelProps={{ shrink: true }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <TextField variant="outlined" label="To" type="date" size='small' InputLabelProps={{ shrink: true }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              <Button color="info" variant="contained" size="large" onClick={GenerateResults} disabled={loading}>
                  {loading ? 'Loading...' : 'Generate'}
                </Button>
            </Grid>
          </Grid>
          <Grid container spacing={.5}>
              <Box sx={{display: 'flex', flexDirection:'column'}}>
                  <Typography>LEGEND :</Typography>
                  <Stack sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                    <CloseIcon fontSize='medium' color="error" /> <Typography>CANCELLED Voucher</Typography>
                  </Stack>
                  <Stack sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                    <FolderOffIcon fontSize='medium' color="warning" /> <Typography>CLOSED Transaction</Typography>
                  </Stack>
                  <Stack sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                    <FolderOpenIcon fontSize='medium' color="info" /> <Typography>OPEN Transaction</Typography>
                  </Stack>
                  <Stack sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                    <CheckIcon fontSize='medium' color="primary" /> <Typography>SUBMITTED Transaction</Typography>
                  </Stack>
              </Box>
          </Grid>
          </Box>
          <CustomTable>
            <TableHeader>
                <CustomHeaderCell></CustomHeaderCell>
                <CustomHeaderCell>Check Voucher Number</CustomHeaderCell>
                <CustomHeaderCell>Date</CustomHeaderCell>
                <CustomHeaderCell>Payee</CustomHeaderCell>
                <CustomHeaderCell>Check Payee</CustomHeaderCell>
                <CustomHeaderCell>Amount Due</CustomHeaderCell>
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
              <Grow in={true} key={variable.ID}>
                <TableRow hover>  
                  <CustomTableBodyCell>
                      <Chip 
                        label={
                          variable.Status === 'ACTIVE' ? 'OPEN' :
                          variable.Status === 'SUBMITTED' ? 'SUBMITTED' :
                          variable.Status === 'CLOSED' ? 'CLOSED' :
                          variable.Status === 'CANCELLED' ? 'CANCELLED' : ''
                        } 
                        color={
                          variable.Status === 'ACTIVE' ? 'info' :
                          variable.Status === 'SUBMITTED' ? 'primary' :
                          variable.Status === 'CLOSED' ? 'warning' :
                          variable.Status === 'CANCELLED' ? 'error' : ''
                        } 
                        icon={
                          variable.Status === 'ACTIVE' ? <FolderOpenIcon/> :
                          variable.Status === 'SUBMITTED' ? <CheckIcon /> :
                          variable.Status === 'CLOSED' ? <FolderOffIcon /> :
                          variable.Status === 'CANCELLED' ? <DoDisturbIcon /> : ''
                        }
                      size="small" />
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {variable.SeriesNo}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                    {dayjs(variable.Date).format('MMMM D, YYYY')}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {variable.PayeeName}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {variable.CheckPayee}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {`₱ ${variable.TotalAmtIssued_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` || `₱ ${variable.TotalAmtIssued_C.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right" width="10%">
                    <Button size="small" variant="contained" onClick={() => SelectData(variable)} >Select</Button>
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
        <Box sx={{ paddingLeft:2 , paddingRight: 2, display: 'flex', justifyContent: 'space-between'}}>
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
  );
};

SearchCheckVoucher.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedData: PropTypes.func,
};

export default SearchCheckVoucher;
