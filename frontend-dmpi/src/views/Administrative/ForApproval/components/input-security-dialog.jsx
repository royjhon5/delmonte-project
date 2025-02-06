import { useDispatch, useSelector } from "react-redux";
import { OPEN_CONFIRM } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid, TextField } from "@mui/material";


const InputSecurityDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openConfirm);
  const CloseDialog = () => { dispatch({ type: OPEN_CONFIRM, openConfirm: false }); }
  
  return (
    <CustomDialog 
        open={open}
        onClose={CloseDialog}
        maxWidth={'xs'}
        DialogTitles={"Input Security Key to Confirm"}
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
                    <Button variant="contained" color="primary" size="small">Confirm</Button>
                    <Button variant="contained" color="error" size="small">Cancel</Button>
                </Grid>
            </Grid>
        }
    />
  )
}

export default InputSecurityDialog