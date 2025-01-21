import { Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { ISTOUPDATE_DEPT, OPEN_ADDDEPARTMENT } from "../../../store/actions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import { useEffect, useState } from "react";

const AddDepartment = ({RefreshData}) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openDepartment);
  //boolean
  const isToUpdate = useSelector((state) => state.customization.isToUpdateDepartment);
  // end here
  const toUpdateData = useSelector((state) => state.customization.departmentData);
  const CloseDialog = () => {
    dispatch({ type: OPEN_ADDDEPARTMENT, openDepartment: false });
    dispatch({ type: ISTOUPDATE_DEPT, isToUpdateDepartment: false });
    setDepartmentName('');
  };
  const [departmentName, setDepartmentName] = useState('');


  const SaveOrUpdateData = async () => {
    const departmentData = { 
      id: isToUpdate ? toUpdateData.id : 0,
      department_name: departmentName,
    };
    try {
      await saveDepartmentData.mutateAsync(departmentData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const saveDepartmentData = useMutation({
    mutationFn: (departmentData) => http.post('/save-department', departmentData),
    onSuccess: () => {
     setDepartmentName('');
     RefreshData();
     dispatch({ type: ISTOUPDATE_DEPT, isToUpdateScanner: false });
     CloseDialog();
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  useEffect(() => {
    if(isToUpdate) {
        setDepartmentName(toUpdateData.name);
    }
  }, [isToUpdate, toUpdateData])

  return (
    <CustomDialog 
        open={open}
        maxWidth={'xs'}
        DialogTitles={isToUpdate ? "Update Department  Details" : "Add New Department"}
        onClose={CloseDialog}
        DialogContents={
            <Box sx={{mt:1}}>
            <TextField label="Department Name" value={departmentName} onChange={(e) => {setDepartmentName(e.target.value)}} fullWidth sx={{ mt:1}} size="medium" />
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

AddDepartment.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddDepartment;
