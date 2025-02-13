import { useDispatch, useSelector } from "react-redux";
import { OPEN_CONFIRM, OPEN_CUSTOM_MODAL } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid, TextField } from "@mui/material";
import http from "../../../../api/http";
import { useState } from "react";
import { useAuth } from "../../../../modules/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";


const InputSecurityDialog = () => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const userid = accessToken.userID;
  const open = useSelector((state) => state.customization.openConfirm);
  const getData = useSelector((state) => state.customization.transferData);
  const [PKey, setPKey] = useState('');
  const [errors, setError] = useState('');
  const CloseDialog = () => { dispatch({ type: OPEN_CONFIRM, openConfirm: false }); }
  const VerifyPersonalKey = async () => {
    try {
      const verified = await http.post('/verify-personalkey', { id: userid, personalkey: PKey });
      if (verified.data.success) {
        const response = await http.post('/post-changestatus', { id: getData, soa_status: 'APPROVED', user_name: accessToken.Fname, user_id: userid, user_designation: 'My Bro'  });
        if(response.data.success) {
            queryClient.invalidateQueries('get-forconfirmation')
            CloseDialog();
            dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
            setPKey('');        
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    } 
  };
  
  return (
    <>
    <CustomDialog 
        open={open}
        onClose={CloseDialog}
        maxWidth={'xs'}
        DialogTitles={"Input personal key to confirm"}
        DialogContents={
            <Box sx={{ padding: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField type="password" fullWidth error={errors ? true : false} size="small" value={PKey} onChange={(e) => {setPKey(e.target.value)}} helperText={errors} />
                    </Grid>
                </Grid>
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" color="primary" size="small" onClick={VerifyPersonalKey}>Confirm</Button>
                    <Button variant="contained" color="error" size="small">Cancel</Button>
                </Grid>
            </Grid>
        }
    />     
    </>
  )
}

export default InputSecurityDialog