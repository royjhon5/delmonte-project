import { Box, Dialog, DialogContent, FormControlLabel, Grid, Grow, IconButton, Switch, TableCell, TablePagination, TableRow, Typography, useTheme } from "@mui/material"
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
import CloseIcon from '@mui/icons-material/Close';

const ViewLogs = ({open, onClose, idLink}) => {
  const theme = useTheme();
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangeDense = (event) => {setDense(event.target.checked);}
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);}

  const getData = async () => {
    setLoading(true)
    try {
      const response = await http.get('/transaction-logs', { params: { id: idLink } })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['checkvoucher-logs'],
    queryFn: getData,
    enabled: open && !!idLink, 
  });

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString(undefined, options);
//   }


  return (
    <>
    <Dialog
    maxWidth="sm"
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
        <DialogContent sx={{padding:0}}>
        <Grid container sx={{padding:1}} spacing={1}>
            <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent:'flex-end', alignItems: 'center'}}>
                <IconButton size="small" color="error" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
            </Grid>
        </Grid>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell width="10%">Remarks</CustomHeaderCell>
            <CustomHeaderCell width="10%">Update By / Date - Time</CustomHeaderCell>  
            
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
              <Grow in={true} key={variable.CPHID }>
                <TableRow hover>  
                  <CustomTableBodyCell >
                      {variable.Particulars}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>
                      {variable.UpdatedBy}
                      <Typography sx={{color: 'rgb(99, 115, 129)' }} variant="body2">
                       {variable.UpdatedDateTime}
                      </Typography>
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
ViewLogs.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    idLink: PropTypes.string
}

export default ViewLogs