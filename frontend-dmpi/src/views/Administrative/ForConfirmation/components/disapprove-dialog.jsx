import { useDispatch, useSelector } from "react-redux";
import { OPEN_CUSTOM_MODAL, OPEN_DISAPPROVE } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import http from "../../../../api/http";
import { useState } from "react";


const DisapproveDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openDisapprove);
  const getData = useSelector((state) => state.customization.transferData);
  const [remarks, setRemarks] = useState('');
  const queryClient = useQueryClient();
  const CloseDialog = () => { dispatch({ type: OPEN_DISAPPROVE, openDisapprove: false }); }
  const UserRemarks = async () => {
    try {
        const response = await http.post('/post-changestatus', { id: getData, soa_status: 'DISAPPROVED', status_remarks: remarks  });
        if(response.data.success) {
            queryClient.invalidateQueries('get-forconfirmation')
            CloseDialog();
            dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });       
        }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.error);
      } else {
        console.log("Server Error");
      }
    } 
  };
  return (
    <CustomDialog 
        open={open}
        onClose={CloseDialog}
        maxWidth={'xs'}
        DialogTitles={"Remarks / Notes / Reason for Disapproval"}
        DialogContents={
            <Box sx={{ padding: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField fullWidth size="small" value={remarks} onChange={(e) => {setRemarks(e.target.value)}} />
                    </Grid>
                </Grid>
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" color="primary" size="small" onClick={UserRemarks}>Confirm</Button>
                    <Button variant="contained" color="error" size="small">Cancel</Button>
                </Grid>
            </Grid>
        }
    />
  )
}

export default DisapproveDialog