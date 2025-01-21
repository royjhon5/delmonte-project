import { Box, Button, Dialog, DialogContent, FormControlLabel, Grid, Grow, Switch, TableCell, TablePagination, TableRow, TextField, useTheme } from "@mui/material"
import PropTypes from 'prop-types'
import NoData from "../../../components/CustomDataTable/NoData";
import CustomTableBodyCell from "../../../components/CustomDataTable/CustomTableBodyCell";
import LoadingData from "../../../components/CustomDataTable/LoadingData";
import CustomHeaderCell from "../../../components/CustomDataTable/CustomHeaderCell";
import CustomTable from "../../../components/CustomDataTable";
import TableHeader from "../../../components/CustomDataTable/TableHeader";
import CustomTableBody from "../../../components/CustomDataTable/TableBody";
import { useQuery} from '@tanstack/react-query';
import { useState } from "react";
import { toast } from "sonner";
import http from "../../../api/http";

const VoucherSelection = ({open, onClose, selectionVoucher}) => {
  const theme = useTheme();
  const [dense, setDense] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangeDense = (event) => {setDense(event.target.checked);}
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}

  const getData = async () => {
    setLoading(true)
    try {
      const response = await http.get('/voucher-details')
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['voucher-details'],
    queryFn: getData,
  });


  const SelectData = (data) => {
    selectionVoucher(data)
    onClose();
  };

  const CloseDialog = () => {
    onClose();
    getData();
  }


  return (
    <>
    <Dialog
    maxWidth="md"
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
            <Grid item xs={12} md={6} >
                <TextField label="Search" fullWidth size="medium" onChange={(e) => {setSearch(e.target.value)}} />
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', justifyContent:'flex-end', alignItems: 'center'}}>
                <Button color="error" variant="contained" onClick={CloseDialog}>Close</Button>
            </Grid>
        </Grid>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell width="10%">Series Number</CustomHeaderCell>
            <CustomHeaderCell width="10%">Payee Name</CustomHeaderCell>
            <CustomHeaderCell width="10%"></CustomHeaderCell>
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
              .filter((reqs) => search.toLowerCase() === '' || reqs.PayeeName.toLowerCase().includes(search.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : [];
          return filteredData.length > 0 ? (
            filteredData.map((variable) => (
              <Grow in={true} key={variable.ID}>
                <TableRow hover>  
                  <CustomTableBodyCell>
                      {variable.SeriesNo}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {variable.PayeeName}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right" width="10%">
                    <Button size="small" variant="contained" onClick={() => SelectData(variable)}>Select</Button>
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
VoucherSelection.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    selectionVoucher: PropTypes.func,  
}

export default VoucherSelection