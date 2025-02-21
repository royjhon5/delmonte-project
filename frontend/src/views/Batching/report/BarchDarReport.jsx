import { Button, Grid, TextField, Typography, } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_DAR_REPORT } from "../../../store/actions";

const DARBatcheReport = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.customization.openDarReport);
    const CloseDialog = () => { dispatch({ type: OPEN_DAR_REPORT, openDarReport: false });}

    return (
        <CustomDialog
            open={open}
            maxWidth={'lg'}
            DialogTitles={"Batched DAR Reports"}
            onClose={CloseDialog}
            DialogContents={
                <Grid container spacing={1}>
                    <Grid item xs={2}>
                        <Typography>
                            Select Date Period
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            <TextField size="small" fullWidth />
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            <TextField size="small" fullWidth />
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            <TextField size="small" fullWidth />
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            <TextField size="small" fullWidth />
                        </Typography>
                    </Grid>
                </Grid>
            }
            DialogAction={
                <Grid container spacing={1} >
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent:'flex-end', alignItems:'flex-end', flexDirection:'row', gap: 1 }}>
                        <Button variant="contained" color="info"> 
                            Print
                        </Button>
                    </Grid>
                </Grid>
            }
        />
    );
}


export default DARBatcheReport;
