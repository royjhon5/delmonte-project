import { Avatar, Box, FormControlLabel, Grow, ListItemText, Switch, TableCell, TablePagination, TableRow, Typography } from "@mui/material"
import CustomTable from "../../../../components/CustomDataTable"
import CustomHeaderCell from "../../../../components/CustomDataTable/CustomHeaderCell"
import TableHeader from "../../../../components/CustomDataTable/TableHeader"
import { Fragment, useEffect, useState } from "react"
import http from "../../../../api/http"
import CustomTableBody from "../../../../components/CustomDataTable/TableBody"
import { toast } from "sonner"
import NoData from "../../../../components/CustomDataTable/NoData"
import CustomTableBodyCell from "../../../../components/CustomDataTable/CustomTableBodyCell"
import LoadingData from "../../../../components/CustomDataTable/LoadingData"

const AllData = () => {
  const [dense, setDense] = useState(false);
  const [getAllData, setGetAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangeDense = (event) => {setDense(event.target.checked);};
  const handleChangePage = (event, newPage) => {setPage(newPage);};
  const handleChangeRowsPerPage = (event) => {setRowsPerPage(parseInt(event.target.value, 10)); setPage(0);};
  
  useEffect(() => {
    getUserClientData();
  }, [])

  const getUserClientData = async () => {
    setLoading(true)
    try {
      const response = await http.get('/client-user-list')
      setGetAllData(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
        <CustomTable size={dense ? 'small' : 'medium'}>
        <TableHeader>
            <CustomHeaderCell>Name</CustomHeaderCell>
            <CustomHeaderCell>Contact Number</CustomHeaderCell>
            <CustomHeaderCell>Role</CustomHeaderCell>
            <CustomHeaderCell>Status</CustomHeaderCell>
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
              {Array.isArray(getAllData) && getAllData.length > 0 ? (
                  getAllData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((variable) => (
                     <>
                      <Grow in={true} key={variable.id}>
                        <TableRow hover>
                            <CustomTableBodyCell display='flex' justifyContent='center' alignItems='center'>
                              <Avatar sx={{ marginRight: '16px' }} />
                              <ListItemText>
                                <Typography sx={{ fontSize:'0.875rem', fontWeight: 400 }}>{variable.first_name} {variable.last_name}</Typography>
                                <Typography sx={{ fontSize:'0.875rem', fontWeight: 400, color: 'rgb(99, 115, 129)' }}variant="body2">{variable.email}</Typography>
                              </ListItemText>
                            </CustomTableBodyCell>
                            <CustomTableBodyCell>
                              {variable.contact_no}
                            </CustomTableBodyCell>
                        </TableRow>
                      </Grow>
                    </>
                  ))
                  ) : (
                    <>
                    <Grow in={true}>
                    <TableRow>
                        <TableCell sx={{ border: 'none'}} colSpan={12}>
                            <NoData />
                        </TableCell>
                    </TableRow>
                    </Grow>
                    </>
                  )}  
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
              count={getAllData ? getAllData.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
    </Fragment>
  )
}

export default AllData