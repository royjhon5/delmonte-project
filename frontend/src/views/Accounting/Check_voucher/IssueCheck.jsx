import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, FilledInput, FormControl, Grid, Grow, InputAdornment, InputLabel, Stack, TableCell, TableRow, TextField, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types'
import CustomTable from '../../../components/CustomDataTable';
import TableHeader from '../../../components/CustomDataTable/TableHeader';
import CustomHeaderCell from '../../../components/CustomDataTable/CustomHeaderCell';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import http from '../../../api/http';
import CustomTableBody from '../../../components/CustomDataTable/TableBody';
import LoadingData from '../../../components/CustomDataTable/LoadingData';
import CustomTableBodyCell from '../../../components/CustomDataTable/CustomTableBodyCell';
import NoData2 from '../../../components/CustomDataTable/NoData2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import AddSubCodeRange from './AddSubCodeRange';
import VerifyPeriodStatus from '../../../components/VerifySwal/ActivateAndDeactivate';
import { useAuth } from '../../../modules/context/AuthContext';
import AddCompanyBranch from './AddCompanyBranch';
import IssueCheckSwal from '../../../components/VerifySwal/IssueCheckSwal';
import CustomLoadingButton from '../../../components/CustomLoadingButton';

const IssueCheck = ({ open, onClose, SeriesNo, refreshDataMain }) => {
  //boolean variables here
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingtwo, setLoadingtwo] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [openModalSubCode, setOpenModalSubCode] = useState(false);
  const [openCancelConfirmSwal, SetOpenCancelConfirmSwal] = useState(false);
  const [openCheckIssuanceSwal, setOpenCheckIssuanceSwal] = useState(false);
  const [openAddCompanyBranch, setOpenAddCompanyBranch] = useState(false);
  const { accessToken } = useAuth();
  const openAddCompanyBranchModal = () => {setOpenAddCompanyBranch(true)}
  const closeAddCompanyBranchModal = () => {setOpenAddCompanyBranch(false)}
  const openSubCodeRange = () => {setOpenModalSubCode(true)}
  const closeSubCodeRange = () => {setOpenModalSubCode(false)}
  const openCancelSwal = () => {SetOpenCancelConfirmSwal(true)}
  const closeCancelSwal = () => {SetOpenCancelConfirmSwal(false)}
  const openConfirmSwal = () => {setOpenCheckIssuanceSwal(true)}
  const closeConfirmSwal = () => {setOpenCheckIssuanceSwal(false)}
  //object and arrays here
  const [datatwo, setDataTwo] = useState([]);
  //variables
  //1st line variables
  const [DebitAmount, setDebitAmount] = useState('');
  const [CreditAmount, setCreditAmount] = useState('');
  const [VoucherNumber, setVoucherNumber] = useState('');
  const [VoucherID, setVoucherID] = useState(0);
  const [VoucherDate, setVoucherDate] = useState('');
  const [VoucherPayeeID, setVoucherPayeeID] = useState(0);
  const [VoucherPayee, setVoucherPayee] = useState('');
  const [VoucherExplanation, setVoucherExplanation] = useState('');
  const [VoucherAddress, setVoucherAddress] = useState('');
  const [VoucherDesignation, setVoucherDesignation] = useState('');
  const [VoucherStatus, setVoucherStatus] = useState('');
  const [issuedBy, setIssuedBy] = useState('');

  //second line variables
  const [CVDetailID, setCVDetailsID] = useState(0);
  const [Company, setCompany] = useState('');
  const [CompanyID, setCompanyID] = useState(0);
  const [CompanyCode, setCompanyCode] = useState('');
  const [branchCode, setBranchCode] = useState(0);
  const [branchID, setBranchID] = useState(0);
  const [Branch, setBranch] = useState('');
  const [Amount, setAmount] = useState('');
  const [Type, setType] = useState('');
  const [AcctCode, setAcctCode] = useState('');
  const [AccSubCode, setAccSubCode] = useState('');
  const [AcctTitle, setAccTitle] = useState('');
  const [Description, setDescription] = useState('');
  //third line variables

  const [BankNames, setBankName] = useState('');
  const [BankAcctNames, setBankAcctName] = useState('');
  const [CheckReferences, setCheckReference] = useState('');
  const [BankIDs, setBankIDs] = useState(0);
  const [BankAmounts, setBankAmount] = useState('');
  const [BankRemarkss, setBankRemarks] = useState('');
  const [BankDates, setBankDate] = useState(dayjs || '');
  const [variantAmount, setVariantAmount] = useState('');
  
  //to Delete ID
  const [selectedCVDtlID, setSelectedCVDtlID] = useState(0);
  const [selectedIDCV_CI, setSelectedIDCV_CI] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedVoucherNumber, setSelectedVoucherNumber] = useState(0);
  const [selectedBankID, setSelectedBankID] = useState(0);
  const [selectedCheckNo, setSelectedCheckNo] = useState(0);
  const queryClient = useQueryClient();

  const CheckIssuance = () => {
    if(!VoucherNumber) return toast.error('No transaction to be submitted');
    if(VoucherStatus === 'CLOSED') return toast.error('Transaction already closed');
    const checkDateFormated = VoucherDate ? dayjs(VoucherDate).format('YYYY-MM-DD') : null;
    const formattedDate = BankDates ? dayjs(BankDates).format('YYYY-MM-DD') : null;
    const formattedMonth = BankDates ? dayjs(BankDates).format('MMMM').toUpperCase() : null;
    const formattedYear = BankDates ? dayjs(BankDates).format('YYYY') : null;
    const formattedTime = BankDates ? dayjs(BankDates).format('HH:mm:ss') : null;
    const voucherData = {
      CVDtlID:CVDetailID, 
      CVIDLink: VoucherID, 
      CVDate: VoucherDate, 
      CheckVoucherSeries:VoucherNumber, 
      CheckDate: checkDateFormated, 
      CheckNo: CheckReferences, 
      BankID:BankIDs , 
      BankName: BankNames, 
      Amount: BankAmounts, 
      PrevAmount:BankAmounts,
      DueMonth: formattedMonth, 
      DueYear:formattedYear, 
      IssuedType: 'ON-DATE', 
      IssuedBy: issuedBy, 
      DateMade:formattedDate, 
      TimeMade: formattedTime, 
      CheckStatus: 'ISSUED', 
      Payee: VoucherPayee, 
      ClearedStatus: 'NO', 
      PayeeID: VoucherPayeeID, 
      Remarks:BankRemarkss, 
      BankAcctNo: BankAcctNames, 
      CVDTLIDLink: CVDetailID,
      CVDAcctCode_C: AcctCode,
      CVDAcctTitle_C: AcctTitle, 
      CVDAcctSubCode_C: AccSubCode, 
      CVDDescription_C: Description, 
      CVDAcct_Amount_C: BankAmounts, 
      Branch: Branch, 
      BranchID: branchID, 
      BranchCode: branchCode, 
      Company: Company, 
      CompanyID:CompanyID, 
      CompanyCode:CompanyCode, 
      Year: formattedYear, 
      Month: formattedMonth, 
      Date: formattedDate, 
    };
    AddNewCheckIssuancec.mutate(voucherData);
  };
  const AddNewCheckIssuancec = useMutation({
    mutationFn: (voucherData) => http.post('/new-checkissuance', voucherData),
    onSuccess: () => {
        toast.success('Data has been saved.');
        getIssuanceData(VoucherNumber);
        queryClient.invalidateQueries('voucherdetailsdata');
        voucherDetailsMain();
        refreshDataMain();
        closeConfirmSwal();
        clearEntry();
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  const getVariants = useCallback(async (seriesNo) => {
    try {
      const response = await http.get('/amount-variance', { params: { SeriesNo: seriesNo, CVDSerieslink: seriesNo } });
      const data = response.data;
      setVariantAmount(data[0].difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '' || '');
      return response.data
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    }
  }, []);

  const getIssuanceData = useCallback(async () => {
    setLoadingtwo(true);
    try {
      const response = await http.get('/checkissued-details', { params: { CheckSeriesNo: SeriesNo } });
      const { details } = response.data;
      setDataTwo(details);
      if (details && details.length > 0) {   
        getVariants(SeriesNo)
      } else {
        setVariantAmount('');
      }
      return response.data
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    } finally {
      setLoadingtwo(false);
    }
  }, [SeriesNo, getVariants]);


  useEffect(() => {
    if (open && SeriesNo) {
      getIssuanceData();
    }
  }, [open, SeriesNo, getIssuanceData]);
  

  const voucherDetailsMain = async () => {
    setLoading(true)
    try {
      const response = await http.get(`/mainvoucher-details`, { params: { SeriesNo: SeriesNo } })
      const { data } = response;
      if (data && data.length > 0) {
        setDebitAmount(data[0].TotalAmtIssued_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
        setVoucherNumber(data[0].CVDSerieslink);
        setVoucherPayee(data[0].PayeeName);
        setVoucherExplanation(data[0].Explanation);
        setVoucherAddress(data[0].PayeeAddress);
        setVoucherDesignation(data[0].PayeeDesignation);
        setVoucherStatus(data[0].Status);
        setVoucherID(data[0].ID);
        setVoucherPayeeID(data[0].PayeeID);
        setIssuedBy(data[0].PreparedBy);
        setVoucherDate(dayjs(data[0].Date).format('YYYY-MM-DD') || null);
        getCreditAmount(data[0].CVDSerieslink);
      } else {
        setDebitAmount('');
        setCreditAmount('');
      }
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Connection failed!')
    } finally {
      setLoading(false)
    }
  };


  const getCreditAmount = useCallback(async (seriesNo) => {
    try {
      const response = await http.get('/credit-amount', { params: { CVDSerieslink: seriesNo } });
      const { totalAmount } = response.data;
      setCreditAmount(totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '')
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    } 
  }, []);

  const { data } = useQuery({
    queryKey: ['voucherdetailsdata'],
    queryFn: voucherDetailsMain,
    enabled: open && !!SeriesNo,  
  });

  const CancelCheckIssuance = async () => {
    try {
      const response = await http.post(`/cancel-check?CVDtlID=${selectedCVDtlID}&CashAmount=${selectedAmount}&IDCV_CI=${selectedIDCV_CI}&CVDSerieslink=${selectedVoucherNumber}&BankRefID=${parseInt(selectedBankID)}&CancelledBy=${accessToken.Fname}&CheckNo=${selectedCheckNo}`);
      if (response.status === 200 || response.data.success) {
        toast.success('Check issuance cancelled successfully!');
        getIssuanceData(VoucherNumber);
        queryClient.invalidateQueries('voucherdetailsdata');
        refreshDataMain();
        closeCancelSwal();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit check issuance');
    }
  };


  const PrintCheckPDF = async (selectedBankName, selectedAcctNo, selectedVouherSeries, selectedID) => {
    setLoadingBtn(prev => ({ ...prev, [selectedID]: true }));
    try {
      const response = await http.get('/printcheck', {
        params: {
          BankName: selectedBankName,
          AccountNumber: selectedAcctNo,
          CheckVoucherSeries: selectedVouherSeries,
          IDCV_CI: selectedID
        },
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    } finally {
      setLoadingBtn(prev => ({ ...prev, [selectedID]: false }));
    }
  };

  const PrintPreviewCV = async () => {
    try {
      const response = await http.get('/printpreview-cv', {
        params: {
          SeriesNo: VoucherNumber,
        },
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    }
  };

  const getCheckVoucherDetails = async (BankID) => {
    try {
      const response = await http.get(`/bank-info?id=${BankID}`);
      const { data } = response;
      setBankIDs(data[0].BankID);
      setBankName(data[0].BankName);
      setBankAcctName(data[0].AccountNumber);
      setCheckReference(data[0].CheckSeries);
    } catch (error) {
      console.error(error);
      toast.error('Connection failed!');
    }
  };

  const SelectData = (data) => {
    setCVDetailsID(data.CVDtlID);
    setCompany(data.Company);
    setCompanyID(data.CompanyID);
    setCompanyCode(data.CompanyCode);
    setBranchID(data.BranchID);
    setBranchCode(data.BranchCode);
    setBranch(data.Branch);
    setAmount(data.CVDAcct_Amount_C);
    setType(data.CVDType);
    setAcctCode(data.CVDAcctCode_C);
    setAccSubCode(data.CVDAcctsubCode_C);
    setAccTitle(data.CVDAcctTitle_C);
    setDescription(data.CVDDescription_C);  
    getCheckVoucherDetails(data.BankID);
  }

  const SelectDataToCancel = (data) => {
    setSelectedCVDtlID(data.CVDTLIDLink);
    setSelectedIDCV_CI(data.IDCV_CI);
    setSelectedAmount(data.Amount);
    setSelectedVoucherNumber(data.CheckVoucherSeries);
    setSelectedBankID(parseInt(data.BankID) || 0);
    setSelectedCheckNo(data.CheckNo)
    openCancelSwal();
  }

  const clearEntry = () => {
    setCompany('');
    setBranch('');
    setAmount('');
    setType('');
    setAcctCode('');
    setAccSubCode('');
    setAccTitle('');
    setDescription('');
    setBankAmount('')
    setBankName('');
    setBankAcctName('');
    setCheckReference('');
    setBankIDs('');
  }


  const getSubCodesData = (data) => {
    setAcctCode(data.ChAMCodeLink);
    setAccSubCode(data.ChASubCode);
    setAccTitle(data.ChAMName);
    setDescription(data.ChADetails);
    getCheckVoucherDetails(data.BankRefID);
  }

  const getCompanyBranchData = (data) => {
    setCompany(data.CompName);
    setBranch(data.BrName);
    setCompanyID(data.CompID);
    setCompanyCode(data.CompCode);
    setBranchID(data.BrID);
    setBranchCode(data.BrCode);
  }

  const SelectToPrint = (data) => {
    PrintCheckPDF(data.BankName, data.BankAcctNo, data.CheckVoucherSeries, data.IDCV_CI);
  }

  const CloseDialog = () => {
    if (VoucherStatus !== 'CLOSED') return;
    onClose();
  }
  

  return (
    <>
    <AddSubCodeRange open={openModalSubCode} onClose={closeSubCodeRange} Data={getSubCodesData} />
    <VerifyPeriodStatus maxWidth="xs" open={openCancelConfirmSwal} onClose={closeCancelSwal} YesOnClick={CancelCheckIssuance} NoOnClick={closeCancelSwal} statusTitle="CANCEL" />
    <AddCompanyBranch open={openAddCompanyBranch} onClose={closeAddCompanyBranchModal} Data={getCompanyBranchData} />
    <IssueCheckSwal open={openCheckIssuanceSwal} onClose={closeConfirmSwal} YesOnClick={CheckIssuance} NoOnClick={closeConfirmSwal}  />
    <Dialog
        maxWidth="xl"
        fullWidth={true}
        onClose={CloseDialog}
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
       <DialogTitle>
        <Stack sx={{
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                alignItems: {xs: '', md: 'center'},
                gap: {xs: 1}
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection:{ sx:'column', md: 'row' }, gap: 1, alignItems:'center' }}>
                    <Typography variant='h4'>Check Issuance</Typography>
                    {VoucherStatus === '' ? '' : 
                    <Chip label={VoucherStatus} 
                    color={
                      VoucherStatus === 'ACTIVE' ? 'info' : 
                      VoucherStatus === 'SUBMITTED' ? 'primary' :
                      VoucherStatus === 'CANCELLED' ? 'error' :
                      'warning'
                    }
                    size="large" 
                    />
                    }
                </Box>
                <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: {xs:'column', md: 'row'}, gap:1}}>
                <TextField value={variantAmount} onChange={(e) => {setVariantAmount(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '},  }} variant="standard" label="VARIANCE" size="small" placeholder="0.00" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                    <TextField value={DebitAmount} onChange={(e) => {setDebitAmount(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '},  }} variant="standard" label="DEBIT AMOUNT" size="small" placeholder="0.00" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                    <TextField value={CreditAmount} onChange={(e) => {setCreditAmount(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '}, }} disabled variant="standard" label="CREDIT AMOUNT" placeholder="0.00" size="small" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                </Box>
            </Stack>
        </DialogTitle>
        <DialogContent>
                <Grid container spacing={1} sx={{mb:1}}>
                    <Grid item xs={12} md={3}>
                        <TextField value={VoucherNumber} onChange={(e) => {setVoucherNumber(e.target.value)}} variant='filled' size='small' fullWidth label="Check Voucher Number" disabled />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField value={VoucherPayee} onChange={(e) => {setVoucherPayee(e.target.value)}} variant='filled' size='small' fullWidth label="Payee" disabled />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField value={VoucherAddress} onChange={(e) => {setVoucherAddress(e.target.value)}} variant='filled' size='small' fullWidth label="Address" disabled />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField value={VoucherDate} onChange={(e) => {setVoucherDate(e.target.value)}} variant='filled' size='small' fullWidth label="Cash Voucher Date" disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField value={VoucherDesignation} onChange={(e) => {setVoucherDesignation(e.target.value)}} variant='filled' size='small' fullWidth label="Designation" disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField value={VoucherExplanation} onChange={(e) => {setVoucherExplanation(e.targer.value)}} variant='filled' size='small' fullWidth label="Explanation" disabled />
                    </Grid>
                </Grid>
                <CustomTable maxHeight={180}>
                    <TableHeader size="small">
                        <CustomHeaderCell>Particulars</CustomHeaderCell>
                        <CustomHeaderCell>DEBIT</CustomHeaderCell>
                        <CustomHeaderCell>CREDIT</CustomHeaderCell>
                        <CustomHeaderCell>Company/Branch</CustomHeaderCell>
                        {/* <CustomHeaderCell>Bank Reference ID</CustomHeaderCell> */}
                        <CustomHeaderCell></CustomHeaderCell>
                    </TableHeader>
                    <CustomTableBody>
            {loading? (
                <>
                  <Grow in={true}>
                    <TableRow>
                      <TableCell colSpan={12}>
                        <LoadingData />
                      </TableCell>
                    </TableRow>
                  </Grow>
                </>
            ) : (
              <>
        {(() => {
        const filteredData = Array.isArray(data) ? data : [];
        const transformedData = filteredData.map(item => ({
          ...item,
          particulars: item.CVDAcctCode_D !== null && item.CVDAcctCode_D !== ''
            ? `${item.CVDAcctCode_D} ${item.CVDAcctCode_D === '' ? '' : '/'} ${item.BranchCode} ${item.CVDAcctCode_D === '' ? '' : '-'} ${item.CVDDescription_D}` 
            : `${item.CVDAcctCode_C} ${item.CVDAcctCode_C === '' ? '' : '/'} ${item.BranchCode} ${item.CVDAcctCode_C === '' ? '' : '-'} ${item.CVDDescription_C}` 
        }));
          return filteredData.length > 0 ? (
            transformedData.map((variable) => (
              <Grow in={true} key={variable.CVDtlID}>
                <TableRow hover>  
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.particulars}</s> : variable.particulars}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1} background={variable.CVDAcct_Amount_D === 0 ? '' : 'orange'}>
                      {variable.CVDAcct_Amount_D === 0 ? '' : `₱ ${variable.CVDAcct_Amount_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1} background={variable.CheckStatus === 'CANCELLED CHECK' ? '' : variable.CVDAcct_Amount_C === 0 ? (variable.CVDAcct_Amount_D === 0 ? 'red' : '') : 'red'}>
                      {
                      variable.CheckStatus === 'CANCELLED CHECK' 
                      ? <s style={{color:'red'}}>{variable.CVDAcct_Amount_C === 0 
                      ? (variable.CVDAcct_Amount_D === 0 
                      ? '₱ 0.00' : '') : `₱ ${variable.CVDAcct_Amount_C.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</s> 
                      : variable.CVDAcct_Amount_C === 0 ? (variable.CVDAcct_Amount_D === 0 ? '₱ 0.00' : '') : `₱ ${variable.CVDAcct_Amount_C.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      }
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.Company} / ${variable.Branch}</s> : `${variable.Company} / ${variable.Branch}`}
                  </CustomTableBodyCell>
                  {/* <CustomTableBodyCell padding={1} >
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.BankRefID}</s> : variable.BankRefID}
                  </CustomTableBodyCell> */}
                  <CustomTableBodyCell textAlign="right" width="10%" padding={0}>
                      {variable.CheckStatus === 'CANCELLED CHECK' 
                      ? '' 
                      : VoucherStatus === 'CLOSED' 
                      ? '' 
                      : variable.BankRefID !== 0 && variable.CVDType === 'CREDIT' && variable.Status === 'SUBMITTED'
                      ? 
                      <>
                      <Button size="small" variant='contained' onClick={() => SelectData(variable)}>Select</Button>
                      
                      </>
                      : ''
                      }         
                  </CustomTableBodyCell>
                </TableRow>
              </Grow>
            ))
          ) : (
            <Grow in={true}>
              <TableRow>
                <TableCell sx={{ border: 'none' }} colSpan={12}>
                  <NoData2 />
                </TableCell>
              </TableRow>
            </Grow>
          );
          })()}
        </>
          )}
        </CustomTableBody>
                </CustomTable>
                <Grid container spacing={1} sx={{mt:.1, mb:1}}>
                    <Grid item xs={12} md={4}>
                      <FormControl variant="filled" fullWidth>
                        <InputLabel>Company</InputLabel>
                        <FilledInput size="small"
                          value={Company}
                          onChange={(e) => {setCompany(e.target.value)}}
                          endAdornment={
                            <InputAdornment position="end">
                                <Button size="small" variant="contained" onClick={openAddCompanyBranchModal} ><SearchIcon /></Button>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField value={Branch} onChange={(e) => {setBranch(e.target.value)}} variant='filled' size='small' fullWidth label="Branch" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField value={Amount} onChange={(e) => {setAmount(e.target.value)}}  fullWidth variant="filled" label="Amount" size="small" placeholder="0.00" InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }} disabled/>
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <TextField value={Type} onChange={(e) => {setType(e.target.value)}} variant='filled' size='small' fullWidth label="Type" />
                    </Grid>
                    <Grid item xs={12} md={1.5}>
                        <TextField value={AcctCode} onChange={(e) => {setAcctCode(e.target.value)}} variant='filled' size='small' fullWidth label="Account Code" />
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                        {/* <TextField value={AccSubCode} onChange={(e) => setAccSubCode(e.target.value)} variant='filled' size='small' fullWidth label="Account Sub Code" /> */}
                        <FormControl variant="filled" fullWidth>
                          <InputLabel>Account Sub Code</InputLabel>
                          <FilledInput size="small"
                            value={AccSubCode}
                            onChange={(e) => setAccSubCode(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                  <Button size="small" variant="contained" onClick={openSubCodeRange}><SearchIcon /></Button>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                        <TextField value={AcctTitle} onChange={(e) => {setAccTitle(e.target.value)}} variant='filled' size='small' fullWidth label="Account Title" />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField value={Description} onChange={(e) => {setDescription(e.target.value)}} variant='filled' size='small' fullWidth label="Desciption" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant='h5'>ISSUED CHECK DETAILS</Typography>
                    </Grid>
                </Grid>
                <CustomTable maxHeight={170}>
                    <TableHeader size="small" >
                        <CustomHeaderCell>Bank</CustomHeaderCell>
                        <CustomHeaderCell>Issued/Encoded By</CustomHeaderCell>
                        <CustomHeaderCell>Check Date</CustomHeaderCell>
                        <CustomHeaderCell>Check Number</CustomHeaderCell>
                        <CustomHeaderCell>Amount</CustomHeaderCell>
                        <CustomHeaderCell width={'20%'}></CustomHeaderCell>
                    </TableHeader>
                    <CustomTableBody>
                    {loadingtwo? (
                <>
                  <Grow in={true}>
                    <TableRow>
                      <TableCell colSpan={12}>
                        <LoadingData />
                      </TableCell>
                    </TableRow>
                  </Grow>
                </>
            ) : (
              <>
        {(() => {
        const filteredData = Array.isArray(datatwo) ? datatwo : [];
        const transformedData = filteredData.map(item => ({...item}));
          return filteredData.length > 0 ? (
            transformedData.map((variable) => (
              <Grow in={true} key={variable.IDCV_CI}>
                <TableRow hover >  
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED' ? <s style={{color:'red'}}>{variable.BankName}</s> : variable.BankName}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED' ? <s style={{color:'red'}}>{variable.IssuedBy}</s> : variable.IssuedBy}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED' ? <s style={{color:'red'}}>{dayjs(variable.CheckDate).format('MMMM D, YYYY')}</s>  : dayjs(variable.CheckDate).format('MMMM D, YYYY')}
                  </CustomTableBodyCell> 
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED' ? <s style={{color:'red'}}>{variable.CheckNo}</s> : variable.CheckNo}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED' ? <s style={{color:'red'}}>{variable.PrevAmount === 0 ? '' : `₱ ${variable.PrevAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</s> : variable.Amount === 0 ? '' : `₱ ${variable.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right" width="10%" padding={0}>
                      {variable.CheckStatus === 'CANCELLED' 
                      ? '' 
                      // : VoucherStatus === 'CLOSED' 
                      // ? '' 
                      : <Button size="small" variant='contained' color="warning" sx={{mr:1}} onClick={() => SelectDataToCancel(variable)}>Cancel Check</Button>}       
                      {variable.CheckStatus === 'CANCELLED' ? '' : 
                      <>
                        <CustomLoadingButton
                          btnClick={() => SelectToPrint(variable)}
                          isDisabled={loadingBtn[variable.IDCV_CI]}
                          btnVariant="contained"
                          label={loadingBtn[variable.IDCV_CI] 
                            ? <>Printing</> 
                            : 'Print Check'}
                          type="submit"
                          btnSize="small"
                          color="info"
                        />
                      </>
                      }     
                  </CustomTableBodyCell>
                </TableRow>
              </Grow>
            ))
          ) : (
            <Grow in={true}>
              <TableRow>
                <TableCell sx={{ border: 'none' }} colSpan={12}>
                  <NoData2 />
                </TableCell>
              </TableRow>
            </Grow>
          );
          })()}
        </>
          )}
        </CustomTableBody>
                </CustomTable>
                <Grid container spacing={1} sx={{mt:1}}>
                    <Grid item xs={12} md={4}>
                        <TextField value={BankNames} onChange={(e) => {setBankName(e.target.value)}} variant='filled' size='small' fullWidth label="Bank Name" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField value={BankAcctNames} onChange={(e) => {setBankAcctName(e.target.value)}} variant='filled' size='small' fullWidth label="Bank Account Name" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField value={CheckReferences} onChange={(e) => {setCheckReference(e.target.value)}} variant='filled' size='small' fullWidth label="Reference/Check Number" />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker label="Date" 
                          value={BankDates}
                          onChange={(newValue) => setBankDate(newValue)} 
                          views={['year', 'month', 'day']}
                          slotProps={{ textField: { size: 'small', variant: 'filled' } }} />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TextField value={BankAmounts} onChange={(e) => {setBankAmount(e.target.value)}} fullWidth variant="filled" label="Amount" size="small" placeholder="0.00" InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }}/>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TextField value={BankRemarkss} onChange={(e) => {setBankRemarks(e.target.value)}} variant='filled' size='small' fullWidth label="Remarks" />
                    </Grid>
                </Grid>
                <Box sx={{mt:1, display:'flex', justifyContent:'flex-end', flexDirection:'row', gap:1}}>
                    {VoucherStatus === 'CLOSED' ?
                      ''
                    : 
                    <Button variant='contained' size='large' onClick={openConfirmSwal} >Save Issuance</Button>
                    }
                    <Button variant='contained' size='large' color="info" onClick={PrintPreviewCV}>PRINT CV</Button>
                    {VoucherStatus === 'CLOSED' ?
                    ''
                    :
                    <Button variant='contained' size='large' color="secondary" onClick={clearEntry}>Clear Entry Screen</Button>
                    }
                    <Button variant='contained' size='large' color="error" onClick={CloseDialog}>Exit / Close Entry form</Button>
                </Box>
        </DialogContent>
      </Dialog>
      </>
  )
}

IssueCheck.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,   
    SeriesNo: PropTypes.string,
    refreshDataMain: PropTypes.func
};

export default IssueCheck