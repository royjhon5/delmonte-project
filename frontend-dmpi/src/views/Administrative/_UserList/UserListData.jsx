import { Box, Button, CircularProgress, Divider, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material"
import { Fragment, useRef, useState } from "react";
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hookContainer } from "../../../hooks/globalQuery";
import http from "../../../api/http";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPEN_DELETESWAL } from "../../../store/actions";
import { useDispatch } from "react-redux";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import ModalCrop from "../../../components/ModalCrop";
import UploadPictureIcon from "../../../components/svg-icons/UploadPictureIcon";
import { useTheme } from "@emotion/react";

const UserListData = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const { data: userData, loading } = hookContainer('/get-users');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedID, setSelectedID] = useState(0);

  const [username, setUsername] = useState('');
  const [position, setPosition] = useState('');
  const [client_name, setClientName] = useState('');
  const [fullName, setFullName] = useState('');
  const [filepath_profilepicture, setFilePathProfilePicture] = useState('');
  const [filepath_esignature, setFilePathESignature] = useState('');

  const convertBytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
  const constMappedData = Array.isArray(userData) ? userData.map((row) => {
    return { ...row, id: row.LoginID  };
  }) : [];
  const SearchFilter = (rows) => {
    return rows.filter(row =>
        row.Username.toLowerCase().includes(search.toLowerCase()) || 
        row.UserLevel.toLowerCase().includes(search.toLowerCase())
    );
  };



  const ColumnHeader = [
    { field: 'Username', headerName: 'Username', width: 250,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.Username}
        </Box>
      ),
     },
    { field: 'UserLevel', headerName: 'User Level', flex:1, },
    { field: 'FullName', headerName: 'Full Name', flex:1, },
    { field: 'Description', headerName: 'Description', flex:1, },
    { field: "action", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (params) => {   
        const SelectedRow = () => {
          setSelectedRowData(params.row);
          setFullName(params.row.FullName);
        }
      return (
        <Box sx={{paddingRight:1}}>
          <IconButton color="primary" size="small" onClick={SelectedRow}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => selectToDelete(params.row.LoginID)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )
      }
    }
  ];

  const checkFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File is larger than 3145728 bytes");
      return false;
    }
      setErrorMessage("");
      return true;
  };

  const handleImgChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      if (!checkFileSize(files)) { 
        setFile(files);
        return;
      }
      setErrorMessage("");
      setFile(files);
      setSrc(files);
      setModalOpen(true);
    }
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };


  const handleSubmit = async () => {
    const UserRegistrationData = { 
      LoginID: selectedRowData ? selectedRowData.LoginID : 0,
      Username: username,
      Position: position, 
      Client_name: client_name,
      FullName: fullName,
      filepath_profilepicture: filepath_profilepicture,
      filepath_esignature: filepath_esignature
    };
    try {
      await UserData.mutateAsync(UserRegistrationData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const UserData = useMutation({
    mutationFn: (UserRegistrationData) => http.post('/user_registration', UserRegistrationData),
    onSuccess: () => {
        queryClient.invalidateQueries(['/get-users']);
        toast.success('New user has been saved.');
        setSelectedRowData(null);
        setFullName('');
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  const selectToDelete = (data) => {
    setSelectedID(data);
    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
  }

  const deleteData = useMutation({
    mutationFn: () => http.delete(`/delete-user?LoginID=${selectedID}`),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries(['/get-users']);
      dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
    }
  });
  
  const DeleteData = () => {
    deleteData.mutate(selectedID);
  };

  const NewClearData = () => {
    setSelectedRowData(null);
    setFullName('');
  }

  return (
    <Fragment>
    <ModalCrop modalOpen={modalOpen} src={src} setPreview={setPreview} setModalOpen={setModalOpen} setFile={setFile}  />
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Grid container spacing={1}>
      
        <Grid item xs={12} md={4}>
        <form noValidate onSubmit={handleSubmit}>
            <Paper sx={{ padding: '80px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 0 }}>
            <div>
                    <Box role="presentation" tabIndex="0" sx={{
                            padding: '8px',
                            margin: 'auto',
                            width: '144px',
                            height: '144px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            borderRadius: '50%',
                            border :'1px dashed rgba(145, 158, 171, 0.2)'
                    }} 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                      <input
                          accept="image/*"  
                          type="file"
                          ref={inputRef}
                          onChange={handleImgChange}
                          style={{ display: 'none' }}
                          tabIndex="-1"
                        />
                          <Box sx={{ 
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            borderRadius: '50%',
                            position: 'relative'
                          }}>
                              <Box sx={{
                                overflow: 'hidden',
                                position: 'relative',
                                verticalAlign: 'bottom',
                                display: 'inline-block',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%'
                              }}>
                                  <Box component="span" className='component-image-wrapper lazy-load-image-background blur lazy-load-image-loaded' 
                                  sx={{ color: 'transparent', display: 'inline-block' 
                                  }}>
                                  {loading ? (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}><CircularProgress /></Box>): (
                                  <img
                                      src={
                                        preview ||
                                        `http://localhost:8000/admin-profile/`
                                        }
                                      style={{ maxWidth: '100%' }}
                                  />
                                  )}
                                  </Box>
                              </Box>
                              <Stack onClick={handleInputClick} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                WebkitBoxAlign: 'center',
                                alignItems: 'center',
                                WebkitBoxPack: 'center',
                                justifyContent: 'center',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 9,
                                borderRadius: '50%',
                                position: 'absolute',
                                color: 'rgb(255, 255, 255)',
                                backgroundColor: 'rgba(22, 28, 36, 0.64)',
                                transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                opacity: isHovered ? 1 : 0
                              }}>
                                <UploadPictureIcon />
                                <Typography fontSize="0.75rem">Upload Image</Typography>
                              </Stack>
                          </Box>           
                    </Box>
                    <Box sx={{
                      mt: '24px', 
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2
                    }}>
                    </Box>
                    <Typography fontSize="0.75rem" sx={{ lineHeight: 1.5, margin: '24px auto 0px', color: 'rgb(99, 115, 129)', display: 'block', textAlign: 'center' }}>
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br />
                      max size of 3 Mb
                    </Typography>
                    {errorMessage && (
                      <Paper variant='outlined' sx={{
                        color: theme.palette.appSettings.paletteMode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 43, 54)',
                        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                        borderRadius: '8px',
                        backgroundImage: 'none',
                        padding: '8px 16px',
                        marginTop: '24px',
                        textAlign: 'left',
                        background: 'rgba(255, 86, 48, 0.08)',
                        border: '1px dashed rgb(255, 86, 48)'
                      }}>
                        <Typography fontSize='0.875rem'>{file.name} - {convertBytesToMB(file.size)} Mb</Typography>                  
                          <Typography fontSize="0.75rem">
                            - {errorMessage}
                          </Typography>
                      </Paper>
                    )}
                </div>                              
            </Paper>
            </form>
        </Grid>

        <Grid item xs={12} md={8}>
            <Paper sx={{padding:2}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' size="small" label="Username" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' size="small" label="Full name" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' size="small" label="Position" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' size="small" label="Client Name" fullWidth />
                    </Grid>


                    <Grid item xs={12} md={6}>
                    <TextField size="small" label="Select Rules" select SelectProps={{ native: true, }} fullWidth>
                        <option></option>
                        <option>Approver</option>
                        <option>Verifier / Confirm</option>
                    </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' size="small" label="Personal Key" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Button fullWidth variant="contained" component="label" color="info">Upload Signature <input type="file" hidden /></Button>
                    </Grid>

                    <Grid item xs={12} md={12} sx={{ mt:2, mb:0.5 }}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap:1, justifyContent: 'flex-end'}}>
                        <Button variant="contained">Save</Button>
                        <Button variant="contained" color="secondary" onClick={NewClearData}>NEW/CLEAR</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>

     
        <Grid item xs={12} md={12}>
            <Paper>
            <Stack id="outlined-select-currency-native" sx={{ display: 'flex', padding: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TextField variant='outlined' value={search} onChange={(e) => {setSearch(e.target.value)}} label="Search" size='medium'  sx={{ width: { xl: '30%', lg: '30%' }}} />
            </Stack>
            <CustomDataGrid 
                columns={ColumnHeader}
                rows={SearchFilter(constMappedData)}
                maxHeight={450}
                height={450}
                slots={{ noRowsOverlay: NoData }}
            />
            </Paper>
        </Grid>
    </Grid>
    </Fragment>
  )
}

export default UserListData