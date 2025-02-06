import { useDispatch, useSelector } from "react-redux";
import { OPEN_CONFIRM, OPEN_CUSTOM_MODAL, OPEN_DISAPPROVE } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid } from "@mui/material";
import Iframe from "react-iframe";
import { Fragment, useState } from "react";
import InputSecurityDialog from "./input-security-dialog";
import DisapproveDialog from "./disapprove-dialog";
import CustomLoading from "../../../../components/LoadSaving/RetrievingData";



const ViewDataDialog = () => {
  const dispatch = useDispatch();
  const [loading, stillLoading] = useState(true);
  const [loadingtwo, stillLoadingtwo] = useState(true)
  const open = useSelector((state) => state.customization.openCustomModal);
  const transferedData = useSelector((state) => state.customization.formData);
  const CloseDialog = () => { dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false }); }
  const openConfirm = () => { dispatch({ type: OPEN_CONFIRM, openConfirm: true }); }
  const openDisapprove = () => { dispatch({ type: OPEN_DISAPPROVE, openDisapprove: true }); }
  return (
    <Fragment>
    <InputSecurityDialog />
    <DisapproveDialog />
    <CustomDialog 
        fullScreen={true}
        open={open}
        onClose={CloseDialog}
        DialogContents={
            <Box sx={{ padding: 0 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        DAR Preview
                        { loading ? <Box sx={{position: 'absolute', top:'40%', left:'22%'}}><CustomLoading title={'Retrieving'} /></Box> : <></> } 
                        <Iframe src={`http://localhost:8000/api/get-printdardetails?id=${transferedData.id}` } width="100%" height="700px" alt='not found' onLoad={() => stillLoading(false)} ></Iframe>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        SOA Preview
                        { loadingtwo ? <Box sx={{position: 'absolute', top:'40%', left:'76%'}}><CustomLoading title={'Retrieving'} /></Box> : <></> } 
                        <Iframe src={`http://localhost:8000/api/get-printsoadetails?id=${transferedData.soa_id}`} width="100%" height="700px" alt='not found' onLoad={() => stillLoadingtwo(false)} ></Iframe>
                    </Grid>
                </Grid>
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Button variant="contained" color="primary" size="large" onClick={openConfirm}>Approve</Button>
                    <Button variant="contained" color="error" size="large" onClick={openDisapprove} >Disapprove</Button>
                </Grid>
            </Grid>
        }
    />
    </Fragment>
  )
}

export default ViewDataDialog