import { useDispatch, useSelector } from "react-redux";
import { ISTOUPDATE_FILES, OPEN_CREATEFILES } from "../../store/actions";
import { useState } from "react";
import { Box, Button, Dialog, DialogContent, Grid, TextField, useTheme } from "@mui/material";
import http from "../../api/http";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import { FileUploader } from "react-drag-drop-files";

const CreateNewFiles = ({ RefreshData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openCreateNewFile);
  const isToUpdate = useSelector((state) => state.customization.isToUpdateFiles);
  const toUpdateData = useSelector((state) => state.customization.filesDataObj);
  const getIDLink = useSelector((state) => state.customization.pass_SubIdLink);
  
  const CloseDialog = () => {
    dispatch({ type: OPEN_CREATEFILES, openCreateNewFile: false });
    dispatch({ type: ISTOUPDATE_FILES, isToUpdateFiles: false });
    setFolderName('');
    setFile(null);
    setFilePreview(null); 
  };
  
  const [folderName, setFolderName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); 
  const fileTypes = ["JPEG", "PNG", "PDF"];

  const handleChange = (file) => {
    setFile(file);
    setFilePreview(URL.createObjectURL(file[0]));
  };

  const saveNewFiles = async () => {
    const FolderData = { 
      id: isToUpdate ? toUpdateData.id : 0,
      id_link: getIDLink,
      sub_folder_name: folderName,
    };
    try {
      await saveNewFolderEntry.mutateAsync(FolderData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
    }
  };

  const saveNewFolderEntry = useMutation({
    mutationFn: (FolderData) => http.post('/save-my-portal-subfolder', FolderData),
    onSuccess: () => {
      setFolderName('');
      CloseDialog();
      RefreshData();
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred");
    }
  });

  return (
    <Dialog
      maxWidth="xs"
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
        boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 
          'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 
          'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
      }}
    >
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          {file ? (
              <>
                <Box sx={{display: 'flex', flexDirection:'column', gap:2}}>
                  <TextField variant="standard" size="small" value={file[0].name} fullWidth label="File name" />
                  <TextField variant="standard" size="small" value={(file[0].size / 1024).toFixed(2)} fullWidth label="File Size (KB)" />
                </Box>
              </>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={12}>
          {filePreview ? (
              <Box sx={{ 
                width: '80px',
                height: '80px',
                flexShrink: 0,
                borderRadius: '10px',
                alignItems:'center',
                position:'relative',
                display: 'inline-flex',
                justifyContent:'center',
               }}>
                <img 
                src={filePreview} 
                alt="Preview" 
                style={{ marginTop: '10px', width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              </Box>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={12}>
            <FileUploader
              multiple={true}
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

CreateNewFiles.propTypes = {
  RefreshData: PropTypes.func,
};

export default CreateNewFiles;
