import { useDispatch, useSelector } from "react-redux";
import { OPEN_CONFIRM, OPEN_CUSTOM_MODAL, OPEN_DISAPPROVE, TRANSFER_DATA } from "../../../../store/actions";
import CustomDialog from "../../../../components/CustomDialog";
import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import Iframe from "react-iframe";
import { Fragment, useState } from "react";
import InputSecurityDialog from "./input-security-dialog";
import DisapproveDialog from "./disapprove-dialog";
import { hookContainer } from "../../../../hooks/globalQuery";


const ViewDataDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openCustomModal);
  const transferedData = useSelector((state) => state.customization.formData);
  const { data: mainData } = hookContainer('/get-soajoindar', {id: transferedData.soa_id});
    const mappedData  = Array.isArray(mainData) ? mainData.map((row) => {
        return { ...row, id: row.id };
    }) : [];
  const [currentPage, setCurrentPage] = useState(1);
  const CloseDialog = () => { dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false })}
  const openConfirm = () => { dispatch({ type: OPEN_CONFIRM, openConfirm: true }), dispatch({ type: TRANSFER_DATA, transferData: transferedData.soa_id}) }
  const openDisapprove = () => { dispatch({ type: OPEN_DISAPPROVE, openDisapprove: true }); dispatch({ type: TRANSFER_DATA, transferData: transferedData.soa_id}) }
  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage);
  };
  const currentDarId = mappedData[currentPage - 1]?.id || "";

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
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', gap:1}}>                   
                        <Typography>SOA Preview</Typography>
                        <Iframe src={`http://localhost:8100/api/get-printsoadetails?id=${transferedData.soa_id}`} width="100%" height="700px" alt='not found' ></Iframe>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', gap:1}}>
                        <Typography>List of DAR Preview </Typography>               
                        <Iframe src={`http://localhost:8100/api/get-printdardetails?id=${currentDarId}`} width="100%" height="700px" title="DAR Preview" />
                        <Pagination 
                            count={mappedData.length} 
                            page={currentPage} 
                            onChange={handlePageChange} 
                            color="primary" 
                            variant="outlined"
                            shape="rounded"
                        />
                    </Grid>
                </Grid>
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Button variant="contained" color="primary" size="large" onClick={openConfirm}>Confirm</Button>
                    <Button variant="contained" color="error" size="large" onClick={openDisapprove} >Disapprove</Button>
                </Grid>
            </Grid>
        }
    />
    </Fragment>
  )
}

export default ViewDataDialog