import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_SAVENEWPAYEE, OPEN_TOUPDATEPAYEE } from "../../../store/actions";
import { useGetPayeeType } from "../../../hooks/globalQuery";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import http from "../../../api/http";
import PropTypes from 'prop-types';

const AddUpdatePayeeModal = ({RefreshData}) => {
  const open = useSelector((state) => state.customization.openSaveNewPayee);
  const isToUpdate = useSelector((state) => state.customization.toUpdatePayee);
  const supplierData = useSelector((state) => state.customization.supplierData);
  const dispatch = useDispatch();
  const CloseDialog = () => { 
    dispatch({ type: OPEN_SAVENEWPAYEE, openSaveNewPayee: false })  
    clearData(); 
    if(isToUpdate) {
        dispatch({ type: OPEN_TOUPDATEPAYEE, toUpdatePayee: false });
    } else {
        ''
    }
  }
  const { data, isLoading } = useGetPayeeType();
  const PayeeType = data ? Array.from(new Set(data.map((payeeType) => payeeType.CCName))) : [];
  const [valueData, setValueData] = useState({
    id: 0,
    PayeeType: '', 
    suppName: '',
    suppDestination: '',
    suppAddress: '',
    suppNo: '',
    suppTin: '',
  });
  const handleAutocompleteChange = (event, newValue) => {
    setValueData({ PayeeType: newValue });
  };

  const clearData = () => {
    setValueData({
        id: 0,
        PayeeType: '', 
        suppName: '',
        suppDestination: '',
        suppAddress: '',
        suppNo: '',
        suppTin: '',
    });
  }

  const saveNewSupplier = () => {
    const Data = {
        supp_type: valueData.PayeeType, 
        supp_name: valueData.suppName, 
        supp_designation: valueData.suppDestination, 
        supp_address: valueData.suppAddress, 
        supp_no: valueData.suppNo, 
        supp_tin: valueData.suppTin
    };
    addNewSupplier.mutate(Data);
  };
  const addNewSupplier = useMutation({
    mutationFn: (Data) => http.post('/new-supplier', Data),
    onSuccess: () => {
        toast.success('New Supplier details has been saved.');
        RefreshData();
        clearData();
        CloseDialog();
    },
    onError: (error) => {
        if (error.response && error.response.status === 400 && error.response.data.error === "Supplier name already exists!") {
            toast.error('Supplier name already exists.');
        } else {
            console.error(error)
        }
    }
  });


  const updateSupplerDetails = () => {
    const Data = {
        id: valueData.id,
        supp_type: valueData.PayeeType, 
        supp_name: valueData.suppName, 
        supp_designation: valueData.suppDestination, 
        supp_address: valueData.suppAddress, 
        supp_no: valueData.suppNo, 
        supp_tin: valueData.suppTin
    };
    UpdateSupplierDetail.mutate(Data);
  };
  const UpdateSupplierDetail = useMutation({
    mutationFn: (Data) => http.post('/update-supplier', Data),
    onSuccess: () => {
        CloseDialog();
        toast.success('Supplier details has been updated.');
        RefreshData();
        clearData();  
    },
    onError: (error) => {
        if (error.response && error.response.status === 400 && error.response.data.error === "Account number already exists!") {
        toast.error('Account number already exists.');
        } else {
        console.error(error)
        }
    }
  });

  useEffect(() => {
    if (isToUpdate) {
      setValueData({
        id: supplierData.id,
        PayeeType: supplierData.type, 
        suppName: supplierData.name,
        suppDestination: supplierData.designation,
        suppAddress: supplierData.address,
        suppNo: supplierData.number,
        suppTin: supplierData.tin,
      });
    }
  }, [isToUpdate, supplierData]);

  return (
    <CustomDialog 
        open={open}
        maxWidth={'xs'}
        onClose={CloseDialog}
        DialogTitles={isToUpdate ? "Update Payee Details" : "Add New Payee"}
        DialogContents={
            <Box sx={{mt:1}}>
            <Autocomplete
                freeSolo
                options={PayeeType}
                loading={isLoading}
                value={valueData.PayeeType}
                noOptionsText={isLoading ? "Loading..." : "No data found"}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="medium"
                        label="Type"
                    />
                )}
            />
            <TextField label="Full name / Supplier Name" fullWidth sx={{ mt:1}} value={valueData.suppName} onChange={(e) =>setValueData({ ...valueData, suppName: e.target.value })} size="medium" />
            <TextField label="Designation" fullWidth sx={{ mt:1}} size="medium" value={valueData.suppDestination} onChange={(e) =>setValueData({ ...valueData, suppDestination: e.target.value })} />
            <TextField label="Address" fullWidth sx={{ mt:1}} size="medium" value={valueData.suppAddress} onChange={(e) =>setValueData({ ...valueData, suppAddress: e.target.value })} />
            <TextField label="Contact Number" fullWidth sx={{ mt:1}} size="medium" value={valueData.suppNo} onChange={(e) =>setValueData({ ...valueData, suppNo: e.target.value })} />
            <TextField label="TIN" fullWidth sx={{ mt:1}} size="medium" value={valueData.suppTin} onChange={(e) =>setValueData({ ...valueData, suppTin: e.target.value })} />
            </Box>
        }
        DialogAction={
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {isToUpdate ? 
                    <Button variant="contained" fullWidth onClick={updateSupplerDetails}>Update Data</Button> 
                    : 
                    <Button variant="contained" fullWidth onClick={saveNewSupplier}>Save Data</Button>}
                </Grid>
            </Grid>
        }
    />
  );
}

AddUpdatePayeeModal.propTypes = {
    RefreshData: PropTypes.func,
}

export default AddUpdatePayeeModal;
