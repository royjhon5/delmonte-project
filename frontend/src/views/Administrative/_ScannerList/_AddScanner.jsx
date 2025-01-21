import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { ISTOUPDATE_SCANNER, OPEN_ADDSCANNER } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddScanner = ({RefreshData}) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openAddScanner);
  //boolean
  const isToUpdate = useSelector((state) => state.customization.isToUpdateScanner);
  // end here
  const toUpdateData = useSelector((state) => state.customization.scannerData);
  const CloseDialog = () => {
    dispatch({ type: OPEN_ADDSCANNER, openAddScanner: false }); 
    dispatch({ type: ISTOUPDATE_SCANNER, isToUpdateScanner: false });
    setScannerName('');
    setDedicatedTmpPath('');
  } 
  const [ScannerName, setScannerName] = useState('');
  const [DedicatedTmpPath, setDedicatedTmpPath] = useState('');


  const SaveOrUpdateData = async () => {
    const ScannerData = { 
      id: isToUpdate ? toUpdateData.id : 0,
      scannerName: ScannerName,
    };
    try {
      await saveNewScannerData.mutateAsync(ScannerData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const saveNewScannerData = useMutation({
    mutationFn: (ScannerData) => http.post('/save-scanner-list', ScannerData),
    onSuccess: () => {
     setScannerName('');
     setDedicatedTmpPath('');
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  useEffect(() => {
    if(isToUpdate) {
        setScannerName(toUpdateData.name);
        setDedicatedTmpPath(toUpdateData.path);
    }
  }, [isToUpdate, toUpdateData])

  return (
    <CustomDialog 
        open={open}
        maxWidth={'xs'}
        DialogTitles={isToUpdate ? "Update Scanner Details" : "Add New Scanner"}
        onClose={CloseDialog}
        DialogContents={
            <Box sx={{mt:1}}>
            <TextField label="Scanner Name" value={ScannerName} onChange={(e) => {setScannerName(e.target.value)}} fullWidth sx={{ mt:1}} size="medium" />
            <TextField label="Dedicated Path Name" value={DedicatedTmpPath} onChange={(e) => {setDedicatedTmpPath(e.target.value)}} fullWidth sx={{ mt:1}} size="medium" />
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {isToUpdate ? 
                    <Button variant="contained" fullWidth onClick={SaveOrUpdateData}>Update Data</Button> 
                    : 
                    <Button variant="contained" fullWidth onClick={SaveOrUpdateData}>Save Data</Button>}
                </Grid>
            </Grid>
        }
    />
  );
}

AddScanner.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddScanner;
