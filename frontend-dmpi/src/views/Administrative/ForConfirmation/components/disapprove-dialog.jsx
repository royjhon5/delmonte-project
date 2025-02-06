import { useDispatch, useSelector } from "react-redux";
import { OPEN_DISAPPROVE } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid, TextField } from "@mui/material";


const DisapproveDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openDisapprove);
  const CloseDialog = () => { dispatch({ type: OPEN_DISAPPROVE, openDisapprove: false }); }
  
  return (
    <CustomDialog 
        open={open}
        onClose={CloseDialog}
        maxWidth={'sm'}
        DialogTitles={"Remarks / Notes / Reason for Disapproval"}
        DialogContents={
            <Box sx={{ padding: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField fullWidth size="small" />
                    </Grid>
                </Grid>
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" color="primary" size="large">Confirm</Button>
                    <Button variant="contained" color="error" size="large">Cancel</Button>
                </Grid>
            </Grid>
        }
    />
  )
}

export default DisapproveDialog