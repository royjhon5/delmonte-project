import { Box, Button, Divider, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Fragment } from "react"
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from "react-redux";
import { IS_UPDATE_FORM, OPEN_CUSTOM_MODAL } from "../../../../store/actions";
import CloseIcon from "../../../../components/svg-icons/CloseIcon";


const DataContainer = () => {
  const dispatch = useDispatch();
    //boolean
  const isToUpdate = useSelector((state) => state.customization.isUpdateForm);
    // end here
  const toUpdateData = useSelector((state) => state.customization.formData);
  const CloseDialog = () => {
    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
    dispatch({ type: IS_UPDATE_FORM, isUpdateForm: false });
  }
  
  return (
    <Fragment>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            WebkitBoxAlign: 'center',
            alignItems: 'center',
            WebkitBoxPack: 'justify',
            justifyContent: 'space-between', 
            padding: '16px 8px 16px 20px'
        }}>
            <Typography fontSize="18px">ADD DAR DETAILS</Typography>
            <IconButton size="medium" onClick={CloseDialog} ><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{
            margin:0,
            flexShrink: 0,
            borderWidth: '0px 0px thin',
            borderStyle: 'dashed'
         }} />
         <Box sx={{ 
            WebkitBoxFlex: 1,
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden'
         }}>
            <PerfectScrollbar >
                <Grid container spacing={1} sx={{ padding: 2 }}>
                    <Grid item xs={12}>
                        <TextField variant="outlined" size="small" fullWidth label="Chapa ID" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant="outlined" size="small" fullWidth label="First Name" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant="outlined" size="small" fullWidth label="Middle Name" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant="outlined" size="small" fullWidth label="Last Name" />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{mb:5}}>
                        <TextField variant="outlined" size="small" fullWidth label="Ext. Name" />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField variant="outlined" size="small" fullWidth label="TIME IN" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField variant="outlined" size="small" fullWidth label="TIME OUT" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField variant="outlined" size="small" fullWidth label="ST" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField variant="outlined" size="small" fullWidth label="OT" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField variant="outlined" size="small" fullWidth label="ND" />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{mb:5}}>
                        <TextField variant="outlined" size="small" fullWidth label="ND-OT" />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <TextField variant="outlined" size="small" fullWidth label="Activity" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField variant="outlined" size="small" fullWidth label="GL" />
                    </Grid>
                    <Grid item xs={12} md={12} sx={{mb:1}}>
                        <TextField variant="outlined" size="small" fullWidth label="Cost Center" />
                    </Grid>

                    <Grid item xs={12} md={12} sx={{display: 'flex', flexDirection:'row', gap: 1, justifyContent:'flex-end'}}>
                        <Button variant="contained" fullWidth>SAVE</Button>
                        <Button variant="contained" color="warning" fullWidth>CLEAR DATA</Button>
                    </Grid>
                </Grid>
            </PerfectScrollbar>
         </Box>
    </Fragment>
  )
}

export default DataContainer