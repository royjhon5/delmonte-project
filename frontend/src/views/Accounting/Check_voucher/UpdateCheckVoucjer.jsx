import PropTypes from 'prop-types';
import { Button, Checkbox, Dialog, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Fragment, useEffect, useState } from 'react';
import AddCompanyDetails from '../../Administrative/close_account_entries/AddCompanyDetails';
import AddPayee from './AddPayee';
import http from '../../../api/http';
import { useAuth } from '../../../modules/context/AuthContext';
import dayjs from 'dayjs'
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

const UpdateVoucher = ({onClose, open, onUpdateData, editVoucherData  }) => {
  const theme = useTheme();
  const {accessToken} = useAuth();

  //boolean state for opening functions
  const [VPayeeOrCPayee, setVPayeeOrCPayee] = useState(false);
  const [addCompany, setAddCompany] = useState(false);
  const [addPayee, setAddPayee] = useState(false);
  const [addCPayee, setAddCPayee] = useState(false);

  //open functions
  const openCompanyModal = () => {setAddCompany(true)}
  const closeCompanyModal = () => {setAddCompany(false)}
  const openPayeeModal = () => {setAddPayee(true), setVPayeeOrCPayee(true)}
  const closePayeeModal = () => {setAddPayee(false)}
  const openCPayeeModal = () => {setAddCPayee(true), setVPayeeOrCPayee(false)}
  const closeCPayeeModal = () => {setAddCPayee(false)}

  //state variables
  const [seriesCode, setSeriesCode] = useState(0);
  const [compID, setCompID] = useState('');
  const [compCode, setCompCode] = useState('');
  const [compName, setCompName] = useState('');
  const [isSeriesNumberEditable, setIsSeriesNumberEditable] = useState(false);

  const [todayDate, setDate] = useState(dayjs || null)
  const [payeeID, setPayeeID] = useState(0)
  const [voucherPayee, setVoucherPayee] = useState('');
  const [voucherTIN, setVoucherTIN] = useState('');
  const [voucherAddress, setVoucherAddress] = useState('')
  const [chequePayee, setChequePayee] = useState('');
  const [Particulars, setParticulars] = useState('');
  const [checkedBy, setCheckedBy] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [approvedBy, setApprovedBy] = useState('');


  useEffect(() => {
    if(editVoucherData) { 
      setSeriesCode(editVoucherData.SeriesNo || '');
      setCompName(editVoucherData.Company || '');
      setVoucherPayee(editVoucherData.PayeeName || '');
      setVoucherTIN(editVoucherData.PayeeDesignation || '');
      setVoucherAddress(editVoucherData.PayeeAddress || '');
      setChequePayee(editVoucherData.chequePayee || '');
      setParticulars(editVoucherData.Explanation || '');
      setCheckedBy(editVoucherData.CheckedBy || '');
      setPreparedBy(editVoucherData.PreparedBy || '');
      setApprovedBy(editVoucherData.ApprovedByPos || '');
    } else { 
      setSeriesCode('');
      setCompName('');
      setVoucherPayee('');
      setVoucherTIN('');
      setVoucherAddress('');
      setChequePayee('');
      setParticulars('');
      setCheckedBy('');
      setPreparedBy(accessToken.Fname || '');
      setApprovedBy('JCPERMITES/RPERMITES' || '');
    }
  }, [editVoucherData, accessToken.userName]);


  const updateVoucherDetails = () => {
    const formattedDate = todayDate ? dayjs(todayDate).format('YYYY-MM-DD') : null;
    const formattedMonth = todayDate ? dayjs(todayDate).format('MMMM').toUpperCase() : null;
    const formattedYear = todayDate ? dayjs(todayDate).format('YYYY') : null;
    const voucherData = {
      id: editVoucherData.ID,
      SeriesNo: seriesCode,
      Date: formattedDate,
      Month: formattedMonth,
      Year: formattedYear,
      PayeeID: payeeID,
      PayeeName: voucherPayee,
      PayeeAddress: voucherAddress,
      PayeeDesignation: voucherTIN,
      Branch: 'MAIN',
      BranchCode: '02',
      BranchID: '27',
      Company: compName,
      CompanyID: compID,
      CompanyCode: compCode,
      Explanation: Particulars,
      PreparedBy: preparedBy,
      CheckedBy: checkedBy,
      ApprovedBy: approvedBy,
      Status: 'ACTIVE',
      UserName: accessToken.userName,
      UserID: accessToken.userID,
      PreparedByPos: accessToken.Desc,
      ApprovedByPos: 'FINANCE/CEO',
      CheckPayee: chequePayee,
      CMonth: formattedMonth,
      CYear: formattedYear,
      RTIN: voucherTIN
    };
    updateVoucher.mutate(voucherData);
  };


  const updateVoucher = useMutation({
    mutationFn: (voucherData) =>
      http.post(`/new-checkvoucher`, voucherData),
    onSuccess: (response, voucherData) => {
      toast.success(response.data.message);
      onUpdateData(voucherData);
      closeModal();
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error;
        if (errorMessage === 'Nothing has changed on the record.') {
            toast.info(errorMessage); 
        } else if (errorMessage === 'Data already exists in the record.') {
            toast.error('Account number already exists in the record.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  });


  //getting data for modals
  const getcompanyID = (data) => {
    setCompID(data)
  }

  const getcompanyName = (data) => {
    setCompName(data)
  }

  const getcompanyCode = (data) => {
    setCompCode(data)
  }

  const getPayeeID = (data) => {
    setPayeeID(data)
  }

  const getVoucherName = (data) => {
    setVoucherPayee(data)
  }

  const getChequePayee = (data) => {
    setChequePayee(data)
  }

  const getVoucherAddress = (data) => {
    setVoucherAddress(data)
  }

  const getVoucherTIN = (data) => {
    setVoucherTIN(data)
  }

  const blankFunction = () => {}

  const handleCheckboxChange = (event) => {
    setIsSeriesNumberEditable(event.target.checked);
    if (!event.target.checked) {
      setSeriesCode(''); 
    }
  }

  const closeModal = () => { 
    onClose();
  }

  const clearData = () => {
    setCompID('')
    setCompCode('')
    setCompName('')
    setPayeeID('')
    setVoucherTIN('')
    setVoucherAddress('')
    setChequePayee('')
    setParticulars('')
    setCheckedBy('')
    setVoucherPayee('')
  }

  
  return (
    <Fragment>
      <AddPayee 
      open={VPayeeOrCPayee ? addPayee : addCPayee} 
      onClose={VPayeeOrCPayee ? closePayeeModal : closeCPayeeModal} 
      VoucherID={getPayeeID} 
      VoucherPayee={VPayeeOrCPayee ? getVoucherName : getChequePayee} 
      VoucherAddress={VPayeeOrCPayee ? getVoucherAddress : blankFunction}
      VoucherTIN={VPayeeOrCPayee ? getVoucherTIN : blankFunction}
      />
      <AddCompanyDetails open={addCompany} onClose={closeCompanyModal} companyName={getcompanyName} companyID={getcompanyID} companyCode={getcompanyCode} />
      <Dialog
        maxWidth="md"
        fullWidth
        onClose={onClose} 
        open={open} 
        BackdropProps={{
            sx: {
              backgroundColor: 'rgba(22, 28, 36, 0.8)',
            }
        }}
        sx={{
            overflowY: 'auto',
            boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px'
        }}
      >
        <DialogContent>
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={12}>
              <Typography variant='h4'>Edit Check Voucher</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Date" 
                value={todayDate}
                onChange={(newValue) => setDate(newValue)} 
                views={['year', 'month', 'day']} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={8}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Company</InputLabel>
              <OutlinedInput
              disabled
                value={compName}
                onChange={(e) => {setCompName(e.target.value)}}
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="contained" onClick={openCompanyModal}><SearchIcon /></Button>
                  </InputAdornment>
                }
                label="Company"
              />
            </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Voucher Payee</InputLabel>
                <OutlinedInput
                  value={voucherPayee}
                  onChange={(e) => {setVoucherPayee(e.target.value)}}
                  disabled
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="contained" onClick={openPayeeModal}><SearchIcon /></Button>
                    </InputAdornment>
                  }
                  label="Voucher Payee"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField value={voucherTIN} onChange={(e) => {setVoucherTIN(e.target.value)}} label="TIN" fullWidth />
            </Grid> 
            <Grid item xs={12} md={6}>
              <TextField value={voucherAddress} onChange={(e) => {setVoucherAddress(e.target.value)}} label="Address" fullWidth />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Cheque Payee</InputLabel>
                <OutlinedInput
                  value={VPayeeOrCPayee ? voucherPayee : chequePayee}
                  onChange={VPayeeOrCPayee ? (e) => {setVoucherPayee(e.target.value)} : (e) => {setChequePayee(e.target.value)}}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="contained" onClick={openCPayeeModal}><SearchIcon /></Button>
                    </InputAdornment>
                  }
                  label="Cheque Payee"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField value={Particulars} onChange={(e) => {setParticulars(e.target.value)}} label="Particulars" multiline rows={4} fullWidth />
            </Grid>
            <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isSeriesNumberEditable} onChange={handleCheckboxChange} />}
                  label="Series Document Number"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField value={checkedBy} onChange={(e) => {setCheckedBy(e.target.value)}} label="Checked By" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CV Number"
                fullWidth
                disabled={!isSeriesNumberEditable}
                value={seriesCode}
                onChange={(e) => setSeriesCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField value={preparedBy} onChange={(e) => {setPreparedBy(e.target.value)}} label="Prepared By" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField value={approvedBy} onChange={(e) => {setApprovedBy(e.target.value)}} label="Approved By" fullWidth />
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex' , justifyContent:'flex-end', flexDirection: 'row', gap:1}}>
              <Button size='large' variant='contained' onClick={updateVoucherDetails}>Update Check Voucher</Button> 
              <Button variant='contained' color="info" onClick={clearData}>New / Clear</Button>
              <Button variant='contained' color="error" onClick={closeModal}>Close</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

UpdateVoucher.propTypes = {
  onUpdateData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  editVoucherData: PropTypes.object,
}

export default UpdateVoucher
