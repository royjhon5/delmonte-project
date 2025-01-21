import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import ModalCrop from '../../../components/ModalCrop';
import UploadPictureIcon from '../../../components/svg-icons/UploadPictureIcon';
import { useAuth } from '../../../modules/context/AuthContext';
import http from '../../../api/http';
import { toast } from 'sonner';
import CustomLoadingButton from '../../../components/CustomLoadingButton';
import UserInfo from './UserInfo';
const GeneralTab = () => {
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [file, setFile] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const convertBytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await http.get(`/user-profile?id_number=${accessToken.idNumber}`)
        setProfilePicture(response.data[0].profile_picture);
        setOldImage(response.data[0].profile_picture);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    }; 
      fetchData();
  }, [accessToken.idNumber]);
  
  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

 

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

  const handleUpload = async () => {
    if(!file) return toast.error('Error: No image has been attached.');
    if (!checkFileSize(file)) return toast.error('Error: File is larger than 3145728 bytes');
    setIsDisabled(true);
    try { 
      const formdata = new FormData();
      formdata.append('id_number', accessToken.idNumber);
      formdata.append('old_image', oldImage);
      formdata.append('image', file);
      const response = await http.post('/upload-profile', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 200) {
        setIsDisabled(false);
        toast.success('Upload successfully')
        setInterval(() => {
          window.location.reload();
        }, 2000);
      } else {
          return;
      }
    } catch(error) {
      console.error(error);
    } 
  }
  return (
    <form>
      <ModalCrop modalOpen={modalOpen} src={src} setPreview={setPreview} setModalOpen={setModalOpen} setFile={setFile}  />
    <Grid container flexDirection="row" spacing={3}>
        <Grid item xs={12} md={4}>
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
                                        `http://localhost:8000/admin-profile/${accessToken.idNumber}/` + profilePicture
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
                    <Button size="small" variant='contained' color="error">
                      Delete
                    </Button>
                    <CustomLoadingButton 
                    btnClick={handleUpload} 
                    isDisabled={isDisabled} 
                    label={isDisabled ? 'Uploading...' : 'Upload Image'} 
                    btnSize={"small"} btnVariant={"contained"} 
                    />
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
        </Grid>
        <Grid item xs={12} md={8}>
            <UserInfo />
        </Grid>
    </Grid>
    </form>
  )
}

export default GeneralTab