import PropTypes from 'prop-types'
import { Box, Button, IconButton, Paper, Stack, TableCell, TablePagination, TableRow, TextField, Fade } from '@mui/material'
import CustomTable from '../../../components/CustomDataTable';
import TableHeader from '../../../components/CustomDataTable/TableHeader';
import CustomHeaderCell from '../../../components/CustomDataTable/CustomHeaderCell';
import CustomTableBody from '../../../components/CustomDataTable/TableBody';
import NoData from '../../../components/CustomDataTable/NoData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import TableMenuList from '../../../components/TableMenu';
import TableMenuItem from '../../../components/TableMenu/TableMenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CustomDialog from '../../../components/CustomDialog';
import { toast } from 'sonner'
import http from '../../../api/http';
import LoadingData from '../../../components/CustomDataTable/LoadingData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchRoles = async () => {
    const response = await http.get('/get-roles');
    return response.data;
};

const ContentData = ({ openDialog, closeDialog  }) => {
    const [page, setPage] = useState(0);
    const [roleData, setRoleData] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const queryClient = useQueryClient();

    const { data, loading } = useQuery({
        queryKey: ['roles'],
        queryFn: fetchRoles
    });

    const OpenMenu = (event, roleId) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoleId(roleId);
    };

    const CloseMenu = () => {
        setAnchorEl(null);
        setSelectedRoleId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const addRoleMutation = useMutation({
        mutationFn: (role) => http.post('/upload-roles', { role }),
            onSuccess: () => {
                toast.success('New role has been saved.');
                setRoleData('');
                queryClient.invalidateQueries({ queryKey: ['roles'] });
            },
            onError: (error) => {
                console.error('Server Error', error);
                if (error.response && error.response.status === 400 && error.response.data.error === "Role already exists!") {
                toast.error('Role already exists!');
                } else {
                toast.error('Server Error');
                }
            }
    });

    const SaveNewRole = () => {
        if (!roleData) {
          return toast.error('Field should not be empty!');
        }
        addRoleMutation.mutate(roleData);
    };

    const deleteRoleMutation = useMutation({
        mutationFn: (roleId) => http.delete(`/delete-roles?id=${roleId}`),
        onSuccess: () => {
          toast.success('Data has been deleted successfully.');
          queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });

    const DeleteRoles = () => {
        if (selectedRoleId) {
          deleteRoleMutation.mutate(selectedRoleId);
          CloseMenu();
        }
    };



  return (
    <Paper>
        <CustomDialog 
            open={openDialog}
            maxWidth="sm"
            onClose={closeDialog}
            DialogTitles="Add New Roles"
            DialogContents={
                <TextField label="Role Description" fullWidth value={roleData} onChange={(e) => setRoleData(e.target.value)} sx={{ mt:1}}  />
            }
            DialogAction={
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Button variant="contained" onClick={SaveNewRole}>Save</Button>
                    <Button variant="contained" color="error" onClick={closeDialog}>Cancel</Button>
                </Box>
            }
        />
        <Stack sx={{ display: 'flex', padding: '20px'}}>
            <TextField variant='outlined' label="Search" sx={{ width: { xl: '50%', lg: '50%' }}} />
        </Stack>
        <CustomTable>
            <TableHeader>
                <CustomHeaderCell>User Role</CustomHeaderCell>
                {Array.isArray(data) && data.length > 0 && (
                <CustomHeaderCell></CustomHeaderCell>
                )}
            </TableHeader>
            <CustomTableBody>
                {loading? (
                    <TableRow>
                        <TableCell colSpan={1}>
                            <LoadingData />
                        </TableCell>
                    </TableRow>) : 
                    (
                    <>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((variable) => (
                            <>
                                <Fade in={true} key={variable.id}>
                                <TableRow hover >
                                    <TableCell sx={{ border: '1px dashed rgb(46, 50, 54)', width: '100%', borderLeft: 'none', borderRight: 'none' }}>{variable.role}</TableCell>
                                    <TableCell sx={{ border: '1px dashed rgb(46, 50, 54)', borderLeft: 'none', borderRight: 'none' }}>
                                            <IconButton 
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(e) => OpenMenu(e, variable.id)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <TableMenuList anchorEl={anchorEl} open={open} CloseMenu={CloseMenu}>
                                                <TableMenuItem ListIcon={<DeleteIcon fontSize='small' color="error" />} ListTypo={"Delete"} color="error" onClick={DeleteRoles}  />
                                                <TableMenuItem ListIcon={<EditRoundedIcon fontSize='small' />} ListTypo={"Edit"} />
                                            </TableMenuList>
                                    </TableCell>
                                </TableRow>
                                </Fade>
                            </>
                        ))
                        ) : (
                            <>
                            <Fade in={true}>
                            <TableRow>
                                <TableCell sx={{ border: 'none'}}>
                                    <NoData />
                                </TableCell>
                             </TableRow>
                            </Fade>
                            </>
                        )}  
                    </>
                    )
                } 
            </CustomTableBody>
        </CustomTable>
        <Box sx={{ padding: 1}}>
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

ContentData.propTypes = {
    roles: PropTypes.array,
    loading: PropTypes.bool,
    onClickEdit: PropTypes.func,
    openDialog: PropTypes.bool,
    closeDialog: PropTypes.func,
    selectedRole: PropTypes.object,
}

export default ContentData