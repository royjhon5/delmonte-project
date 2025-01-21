import { useDispatch, useSelector } from "react-redux";
import { ISTOUPDATE_FOLDER, OPEN_CREATENEWFOLDER } from "../../store/actions";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, TextField, useTheme } from "@mui/material";
import { useAuth } from "../../modules/context/AuthContext";
import http from "../../api/http";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import PropTypes from 'prop-types';

const CreateNewFolder = ({RefreshData}) => {
  const { accessToken } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openCreateNewFolder);
  //boolean
  const isToUpdate = useSelector((state) => state.customization.isToUpdateFolder);
  // end here
  const toUpdateData = useSelector((state) => state.customization.folderData);
  const CloseDialog = () => {
    dispatch({ type: OPEN_CREATENEWFOLDER, openCreateNewFolder: false });
    dispatch({ type: ISTOUPDATE_FOLDER, isToUpdateFolder: false });
    setFolderName('');
  };
  const [folderName, setFolderName] = useState('');

  const saveNewFolder = async  () => {
    const FolderData = { 
      id: isToUpdate ? toUpdateData.id : 0,
      folder_name: folderName,
			user_id_link: accessToken.userID,
    };
    try {
      await saveNewFolderEntry.mutateAsync(FolderData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
    }
  };
  const saveNewFolderEntry = useMutation({
    mutationFn: (FolderData) => http.post('/save-my-portal-folder', FolderData),
    onSuccess: () => {
      setFolderName('');
      CloseDialog();
      RefreshData();
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred");
    }
  });

  const onPressEnterSaveData = (event) => {
    if (event.key === 'Enter') {
      saveNewFolder();
    }
  };

  useEffect(() => {
    if(isToUpdate) {
        setFolderName(toUpdateData.folder_name);
    }
  }, [isToUpdate, toUpdateData])
  
  
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
        boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
    }}
    >
      <DialogContent>
        <TextField autoFocus value={folderName} onKeyDown={onPressEnterSaveData} onChange={(e) => {setFolderName(e.target.value)}} variant="standard" fullWidth />
      </DialogContent>
    </Dialog>
  )
}

CreateNewFolder.propTypes = {
  RefreshData: PropTypes.func,
}

export default CreateNewFolder