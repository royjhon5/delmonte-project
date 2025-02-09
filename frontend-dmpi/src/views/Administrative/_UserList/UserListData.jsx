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
import { CheckmarkIcon } from "react-hot-toast";
import UserProfPic from "../../../assets/images/user.png"

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
  const [filepath_esignature, setFilePathESignature] = useState('');
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
  const [roles, setRoles] = useState('');
  const [personal_key, setPersonalKey] = useState('');
  

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
    { field: 'Position', headerName: 'Position', flex:1, },
    { field: "action", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (params) => {   
        const SelectedRow = () => {
          setSelectedRowData(params.row);
          setUsername(params.row.Username);
          setPosition(params.row.Position);
          setClientName(params.row.Client_name);
          setRoles(params.row.roles);
          setPersonalKey(params.row.personal_key);
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

  const handleUpload = async () => {
    if(!file) return toast.error('Error: No image has been attached.');
    try { 
      const uploadProfPic = new FormData();
      const uploadESig = new FormData();
      uploadProfPic.append('filename', file.name);
      uploadProfPic.append('file', file);
      uploadESig.append('efilename', filepath_esignature[0].name);
      uploadESig.append('efile', filepath_esignature[0]);
      const uploadProf  = await http.post('/upload-profile', uploadProfPic, { headers: { 'Content-Type': 'multipart/form-data'}});
      const uploadSign  = await http.post('/upload-esignature', uploadESig, { headers: { 'Content-Type': 'multipart/form-data'}});
      if (!uploadProf.data.success) return alert(uploadProf.data.message);
      if (!uploadSign.data.success) return alert(uploadProf.data.message);
      const saveResponse = await http.post('/register', {
        LoginID: selectedRowData ? selectedRowData.LoginID : 0,
        Username: username,
        Position: position,
        roles: roles,
        personal_key: personal_key,
        Client_name: client_name,
        FullName: fullName,
        filepath_profilepicture: file.name,
        filepath_esignature: filepath_esignature[0].name,
      });
      if (saveResponse.status === 200) {
        toast.success('File and data saved successfully!');
        NewClearData(); 
      } else {
        toast.error('Error saving data. Please try again.');
      }
    } catch(error) {
      console.error(error);
    } 
  }

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
    setUsername('');
    setFullName('');
    setPosition('');
    setClientName('');
    setRoles('');
    setPersonalKey('');
    setFile(null);
    setFilePathESignature('');
  }

  return (
    <Fragment>
    <ModalCrop modalOpen={modalOpen} src={src} setPreview={setPreview} setModalOpen={setModalOpen} setFile={setFile}  />
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Grid container spacing={1}>
      
        <Grid item xs={12} md={4}>
        <form noValidate onSubmit={handleUpload}>
            <Paper sx={{ padding: '30px 24px 27px', textAlign: 'center', position: 'relative', zIndex: 0 }}>
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
                                        (selectedRowData
                                          ? `http://localhost:8100/api/get-displayimage?src=${selectedRowData.filepath_profilepicture}`
                                          : `${UserProfPic}`)                     
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
                        <TextField variant='outlined' value={username} onChange={(e) => {setUsername(e.target.value)}} size="small" label="Username" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' value={fullName} onChange={(e) => {setFullName(e.target.value)}} size="small" label="Full name" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' value={position} onChange={(e) => {setPosition(e.target.value)}} size="small" label="Position" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' value={client_name} onChange={(e) => {setClientName(e.target.value)}} size="small" label="Client Name" fullWidth />
                    </Grid>


                    <Grid item xs={12} md={6}>
                    <TextField size="small" label="Select Roles" select SelectProps={{ native: true, }} value={roles} onChange={(e) => {setRoles(e.target.value)}} fullWidth>
                        <option></option>
                        <option value="Approver">Approver</option>
                        <option value="Verifier">Verifier / Confirm</option>
                    </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField variant='outlined' value={personal_key} onChange={(e) => {setPersonalKey(e.target.value)}} size="small" label="Personal Key" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Button fullWidth variant="contained" 
                      startIcon={<Box component="div" sx={{ display: filepath_esignature !== '' ? "block" : "none" }}><CheckmarkIcon color="primary" /></Box>}
                      value={selectedRowData ? selectedRowData.filepath_esignature : filepath_esignature}  
                      component="label" color="warning">
                      {selectedRowData ? `Update - ${selectedRowData.filepath_esignature}` : filepath_esignature !== '' ? `Signature Uploaded - Filename: ${filepath_esignature[0].name}` : "Upload Signature"} 
                      <input type="file" onChange={(e) => {setFilePathESignature(e.target.files)}} hidden /></Button>
                    </Grid>

                    <Grid item xs={12} md={12} sx={{ mt:2, mb:0.5 }}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap:1, justifyContent: 'flex-end'}}>
                        <Button variant="contained" onClick={handleUpload}>Save</Button>
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
                maxHeight={400}
                height={400}
                slots={{ noRowsOverlay: NoData }}
            />
            </Paper>
        </Grid>
    </Grid>
    </Fragment>
  )
}

export default UserListData