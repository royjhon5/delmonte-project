import { useDispatch, useSelector } from "react-redux";
import { ISTOUPDATE_SUBFOLDER, OPEN_CREATENEWSUBFOLDER } from "../../store/actions";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, TextField, useTheme } from "@mui/material";
import http from "../../api/http";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import PropTypes from 'prop-types';

const CreateNewSubFolder = ({RefreshData}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openCreateSubNewFolder);
  //boolean
  const isToUpdate = useSelector((state) => state.customization.isToUpdateSubFolder);
  // end here
  const toUpdateData = useSelector((state) => state.customization.SubfolderData);
  const getIDLink = useSelector((state) => state.customization.passIdlink)
  const CloseDialog = () => {
    dispatch({ type: OPEN_CREATENEWSUBFOLDER, openCreateSubNewFolder: false });
    dispatch({ type: ISTOUPDATE_SUBFOLDER, isToUpdateSubFolder: false });
    setFolderName('');
  };
  const [folderName, setFolderName] = useState('');

  const saveNewFolder = async  () => {
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

  const onPressEnterSaveData = (event) => {
    if (event.key === 'Enter') {
      saveNewFolder();
    }
  };

  useEffect(() => {
    if(isToUpdate) {
        setFolderName(toUpdateData.sub_folder_name);
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

CreateNewSubFolder.propTypes = {
  RefreshData: PropTypes.func,
}

export default CreateNewSubFolder