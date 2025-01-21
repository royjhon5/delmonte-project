import PropTypes from 'prop-types';
import { Button, Checkbox, Dialog, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { CASHVOUCHER_DATA, IS_CHECKPAYEE, IS_UPDATECASHVOUCHER, OPEN_ADDNEWCOMPANY, OPEN_ADDPAYEE, OPEN_NEWCASHVOUCHER } from '../../../store/actions';
import { useAuth } from '../../../modules/context/AuthContext';
import AddCompanyDetails from './AddCompanyDetails';
import AddPayee from './AddPayee';
import { useGetBranch, useGetCvSignatory } from '../../../hooks/globalQuery';
import http from '../../../api/http';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

const NewCashVoucher = () => {
  const theme = useTheme();
  const { accessToken } = useAuth();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  //STATE BOOLEANS
  const [isSeriesNumberEditable, setIsSeriesNumberEditable] = useState(false);
  //ENDS HERE

  //get data
  const { data: signatoryData } = useGetCvSignatory();
  const { data: branchData } = useGetBranch();
  //ends here
  
  // OPEN STATE FOR MODAL AND GETTING DATA FROM REDUX
  const open = useSelector((state) => state.customization.openNewCashVoucher);
  const VerifyIfCheckPayee = useSelector((state) => state.customization.isCheckPayee);
  const isToUpdateData = useSelector((state) => state.customization.isUpdateCashVoucher);
  const voucherData = useSelector((state) => state.customization.cashvoucherData);
  const dispatch = useDispatch();
  const CloseNewCashVoucher = () => {dispatch({ type: OPEN_NEWCASHVOUCHER, openNewCashVoucher: false }); clearData();};
  const OpenAddNewCompany = () => {dispatch({ type: OPEN_ADDNEWCOMPANY, openAddNewCompany: true })};
  const OpenAddPayee = () => {dispatch({ type: OPEN_ADDPAYEE, openAddPayee: true })};
  const OpenAddCheckPayee = () => {dispatch({ type: OPEN_ADDPAYEE, openAddPayee: true }), dispatch({ type: IS_CHECKPAYEE, isCheckPayee: true })};
  // ENDS HERE

  // INPUT VARIABLES HERE
  const [_id, setID] = useState(0);
  const [dateToday, setDate] = useState(dayjs || null);
  const [cashSeriesCode, setCashSeriesCode] = useState('');
  const [customSeriesCode, setCustomSeriesCode] = useState('');
  const [CompanyID, setCompanyID] = useState(0);
  const [CompanyCode, setCompanyCode] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  const [PayeeID, setPayeeID] = useState(0);
  const [PayeeName, setPayeeName] = useState('');
  const [Tin, setTin] = useState('');
  const [Address, setAddress] = useState('');
  const [ChequePayee, setChequePayee] = useState('');
  const [Particulars, setParticulars] = useState('');
  const [CheckedBy, setCheckedBy] = useState('');
  const [ApprovedBy, setApprovedBy] = useState('');
  const [branchID, setBranchID] = useState(0);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  //ENDS HERE

  const getCashSeriesCode = useCallback(async () => {
    try {
      const response = await http.get('/cashseries-code');
      const initialCode = response.data.latestId ? `${year}${month}-${response.data.latestId}` : `${year}${month}-1`;
      setCashSeriesCode(initialCode);
    } catch (error) {
      console.error(error);
    }
  }, [month, year]);


  const saveCashVoucher = () => {
    const formattedDate = dateToday ? dayjs(dateToday).format('YYYY-MM-DD') : null;
    const formattedMonth = dateToday ? dayjs(dateToday).format('MMMM').toUpperCase() : null;
    const formattedYear = dateToday ? dayjs(dateToday).format('YYYY') : null;
    const voucherData = {
      SeriesNo: isSeriesNumberEditable ? customSeriesCode : cashSeriesCode,
      Date: formattedDate,
      Month: formattedMonth,
      Year: formattedYear,
      PayeeID: PayeeID,
      PayeeName: PayeeName,
      PayeeLName: ChequePayee,
      PayeeAddress: Address,
      PayeeDesignation: Tin,
      Branch: branchName,
      BranchCode: branchCode,
      BranchID: branchID,
      Company: CompanyName,
      CompanyID: CompanyID,
      CompanyCode: CompanyCode,
      Explanation: Particulars,
      PreparedBy: accessToken.Fname,
      CheckedBy: CheckedBy,
      ApprovedBy: ApprovedBy,
      Status: 'ACTIVE',
      UserName: accessToken.userName,
      UserID: accessToken.userID,
      id: isToUpdateData ? _id : 0
    };
    addCashVoucher.mutate(voucherData);
  };
  const addCashVoucher = useMutation({
    mutationFn: (voucherData) => http.post('/new-cashvoucher', voucherData),
    onSuccess: (response, voucherData) => {
      toast.success(response.data.message);
      dispatch({type: CASHVOUCHER_DATA, cashvoucherData: voucherData});
      CloseNewCashVoucher();
    },
    onError: (error) => {
      if (error.response && error.response.status === 400 && error.response.data.error === "Accounting Entries has no Active Period for Encoding. Contact Accounting Personnel Incharge (Dept-Heads).") {
        toast.error('Accounting Entries has no Active Period for Encoding. Contact Accounting Personnel Incharge (Dept-Heads).');
      } else if (error.response && error.response.status === 400 && error.response.data.error === "Period Date for Journal Entry already closed.") {
        toast.error('Period Date for Journal Entry already closed.');
      } else {
        console.error(error);
      }
    }
  });
  
  useEffect(() => {
    if(isToUpdateData) {
      setCompanyName(voucherData.Company);
      setPayeeName(voucherData.PayeeName);
      setTin(voucherData.PayeeDesignation);
      setAddress(voucherData.PayeeAddress);
      setChequePayee(voucherData.PayeeLName);
      setParticulars(voucherData.Explanation);
      setCheckedBy(voucherData.CheckedBy);
      const seriesNoParts = voucherData.SeriesNo.split('-');
      const suffix = seriesNoParts.length > 1 ? seriesNoParts[1] : ''; 
      setID(suffix)
    } else {
      setApprovedBy(signatoryData?.length > 0 ? signatoryData[0].ApprovedBy : '' || '');
      setBranchName(branchData?.length > 0 ? branchData[0].BrName : '' || '');
      setBranchCode(branchData?.length > 0 ? branchData[0].BrCode : '' || '');
      setBranchID(branchData?.length > 0 ? branchData[0].BrID : '' || '');
      getCashSeriesCode();
    }
  }, [getCashSeriesCode, signatoryData, branchData, isToUpdateData, voucherData]);

  const clearData = () => {
    dispatch({ type: IS_CHECKPAYEE, isCheckPayee: false });
    dispatch({type: IS_UPDATECASHVOUCHER, isUpdateCashVoucher: false});
    setCompanyID('');
    setCompanyName('');
    setCompanyCode('');
    setPayeeID('');
    setPayeeName('');
    setTin('');
    setAddress('');
    setChequePayee('');
    setParticulars('');
    setCheckedBy('')
  }

  const handleCheckboxChange = (event) => {
    setIsSeriesNumberEditable(event.target.checked);
    if (!event.target.checked) {
      setCustomSeriesCode(''); 
    }
  }

  const CompanyData = (data) => {
    setCompanyID(data?.id || '');
    setCompanyName(data?.name || '');
    setCompanyCode(data?.code || '');
  }

  const SupplierData = (data) => {
    setPayeeID(data?.id || '');
    setPayeeName(data?.name || '');
    setTin(data?.tin || '');
    setAddress(data?.address || '');
    setChequePayee(data?.name || '')
  }

  const CheckPayee = (data) => {
    setChequePayee(data?.name || '')
  }

  

  return (
    <Fragment>
      <AddCompanyDetails objData={CompanyData} />
      <AddPayee objData={ VerifyIfCheckPayee ? CheckPayee : SupplierData } /> 
      <Dialog
        maxWidth="md"
        fullWidth
        onClose={CloseNewCashVoucher} 
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
              <Typography variant='h4'>{isToUpdateData ? 'Update Cash Voucher Details' : 'New Cash Voucher'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Date" 
                value={dateToday}
                onChange={(newValue) => setDate(newValue)} 
                views={['year', 'month', 'day']} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={8}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Company</InputLabel>
              <OutlinedInput
              disabled
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="contained" onClick={OpenAddNewCompany}><SearchIcon /></Button>
                  </InputAdornment>
                }
                label="Company"
                value={CompanyName}
                onChange={(e) => {setCompanyName(e.target.value)}}
              />
            </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Voucher Payee</InputLabel>
                <OutlinedInput
                  disabled
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="contained" onClick={OpenAddPayee}><SearchIcon /></Button>
                    </InputAdornment>
                  }
                  value={PayeeName}
                  onChange={(e) => {setPayeeName(e.target.value)}}
                  label="Voucher Payee"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="TIN" fullWidth value={Tin} onChange={(e) => setTin(e.target.value)} />
            </Grid> 
            <Grid item xs={12} md={6}>
              <TextField label="Address" fullWidth value={Address} onChange={(e) => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Cheque Payee</InputLabel>
                <OutlinedInput
                  value={ChequePayee}
                  onChange={(e) =>
                    setChequePayee(e.target.value)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="contained" onClick={OpenAddCheckPayee}><SearchIcon /></Button>
                    </InputAdornment>
                  }
                  label="Cheque Payee"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField label="Particulars" multiline rows={4} fullWidth value={Particulars} onChange={(e) => setParticulars(e.target.value)} />
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
              <TextField label="Checked By" fullWidth value={CheckedBy} onChange={(e) => {setCheckedBy(e.target.value)}} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CV Number"
                fullWidth
                value={customSeriesCode}
                onChange={(e) => setCustomSeriesCode(e.target.value)}
                disabled={isSeriesNumberEditable ? false : true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Prepared By" fullWidth value={accessToken.Fname} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Approved By" fullWidth value={ApprovedBy} onChange={(e) => setApprovedBy(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex' , justifyContent:'flex-end', flexDirection: 'row', gap:1}}>
              {isToUpdateData 
              ? 
              <Button size='large' variant='contained' fullWidth onClick={saveCashVoucher}>Update Cash Voucher</Button> 
              : 
              <Button size='large' variant='contained' fullWidth onClick={saveCashVoucher}>Set Cash Voucher</Button>
              }
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

NewCashVoucher.propTypes = {
  onSaveData: PropTypes.func,
}

export default NewCashVoucher