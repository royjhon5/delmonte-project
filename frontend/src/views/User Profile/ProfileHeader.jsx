import { Avatar, Box, ListItemText, Paper, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react";
import http from "../../api/http";
import { AuthContext } from "../../modules/context/AuthContext";
import UploadPictureIcon from "../../components/svg-icons/UploadPictureIcon";
import ModalCropCoverPhoto from "../../components/ModalCropCoverPhoto";
import { toast } from "sonner";
import CustomLoadingButton from "../../components/CustomLoadingButton";

const ProfileHeader = () => {
  const { accessToken } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef(null);
  const [file, setFile] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [oldImage, setOldImage] = useState("");
  const [coverPicture, setCoverPicture] = useState("");

  const handleInputClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };


  console.log(oldImage)
  useEffect(() => {
   const fetchData = async () => {
    try {
      const response = await http.get(`/user-profile?id_number=${accessToken.idNumber}`)
      setProfilePicture(response.data[0].profile_picture);
      setCoverPicture(response.data[0].cover_photo);
      setOldImage(response.data[0].cover_photo);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }; 
    fetchData();
  }, [accessToken.idNumber]);


  const handleImgChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      setFile(files);
      setSrc(files);
      setModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if(!file) return toast.error('Error: No image has been attached.');
    setIsDisabled(true);
    try { 
      const formdata = new FormData();
      formdata.append('id_number', accessToken.idNumber);
      formdata.append('old_image', oldImage);
      formdata.append('image', file);
      const response = await http.post('/upload-cover', formdata, {
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
    <>
    <ModalCropCoverPhoto modalOpen={modalOpen} src={src} setPreview={setPreview} setModalOpen={setModalOpen} setFile={setFile}  />
    <Paper sx={{
        height: '350px',
        mb: '24px',
        position: 'relative',
        backgroundImage: 'none', 
        overflow:'hidden',
        zIndex: 0,
    }}>
        <Box sx={{
            height: '100%',
            color: 'white',
            background: 'linear-gradient(rgba(0, 75, 80, 0.8), rgba(0, 75, 80, 0.8)) center center / cover no-repeat',
            backgroundPosition: 'center center',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={
                  preview ||
                    // `http://localhost:8000/admin-profile/${accessToken.idNumber}/` + coverPicture
                    `https://cu-app-server.vercel.app/admin-profile/${accessToken.idNumber}/` + coverPicture
                  }
                style={{ height: '100%',width: '100%', objectFit: 'cover', }}
            />
            <input
              accept="image/*"  
              type="file"
              ref={inputRef}
              onChange={handleImgChange}
              style={{ display: 'none' }}
              tabIndex="-1"
            />
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
                position: 'absolute',
                color: 'rgb(255, 255, 255)',
                backgroundColor: 'rgba(22, 28, 36, 0.64)',
                transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                opacity: isHovered ? 1 : 0
              }}>
                <UploadPictureIcon />
                <Typography fontSize="0.75rem">Upload Cover Image</Typography>
            </Stack>
            <Stack sx={{
                display: 'flex',
                left: '24px',
                bottom: '24px',
                zIndex: 10,
                paddingto: 0,
                position: 'absolute', 
                flexDirection: 'row'
            }}>
                <Avatar 
                    sx={{
                        width: '128px',
                        height: '128px',
                        position: 'relative',
                        display: 'flex',
                        border: '2px solid rgb(255, 255, 255)',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: 1,
                        background: 'white'
                    }}
                    src={profilePicture ? `http://localhost:8000/admin-profile/${accessToken.idNumber}/` + profilePicture : ''}
                />
                <ListItemText sx={{
                    minWidth: 0,
                    margin: '24px 24px 0px',
                    flex: '1 1 auto',
                    textAlign: 'unset'
                }}>
                    <Typography sx={{ fontSize: '1.25rem'}}>{accessToken.fName}</Typography>
                    <Typography>{accessToken.idNumber}</Typography>
                </ListItemText>
            </Stack>
        </Box>
        <Paper sx={{
            overflow: 'hidden',
            minHeight: '48px',
            display: 'flex',
            width: '100%',
            bottom: '0px',
            zIndex:9,
            position: 'absolute',
            justifyContent: 'flex-end',
            borderRadius: 0,
            alignItems: 'center', 
            paddingRight: 2
        }}>
            <CustomLoadingButton 
                btnClick={handleUpload} 
                isDisabled={isDisabled} 
                label={isDisabled ? 'Uploading...' : 'Upload Image'} 
                btnSize={"small"} btnVariant={"contained"} 
            />
        </Paper>
    </Paper>
    </>
  )
}

export default ProfileHeader