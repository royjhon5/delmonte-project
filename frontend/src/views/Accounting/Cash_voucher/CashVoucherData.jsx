import { Autocomplete, Box, Button, Chip, CircularProgress, FilledInput, FormControl, Grid, Grow, IconButton, InputAdornment, InputLabel, Paper, Stack, TextField, Typography } from "@mui/material"
import { Fragment, useCallback, useEffect, useState } from "react"
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BackupIcon from '@mui/icons-material/Backup';
import { useDispatch, useSelector } from "react-redux";
import { CASHVOUCHER_DATA, CHANGE_SWAL_ENV, IS_UPDATECASHVOUCHER, OPEN_COMPANYBRANCHSELECTION, OPEN_NEWCASHVOUCHER, OPEN_SUBCODESELECTION, OPEN_SWALCONFIRMATION, OPEN_VOUCHERSELECTION } from "../../../store/actions";
import NewCashVoucher from "./NewCashVoucher";
import { toast } from "sonner";
import { useGetBranch, useGetCashFlow, useGetSubCodes } from "../../../hooks/globalQuery";
import CashVoucherSelection from "./CashVoucherSelection";
import dayjs from "dayjs";
import SubCodeSelection from "./_SubCodeSelection";
import CompanyBranchSelection from "./_CompanyBranchSelection";
import CustomDataGrid from "../../../components/CustomDataGrid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../../../api/http";
import CustomLoadingButton from "../../../components/CustomLoadingButton";
import XSDotFlash from "../../../components/DotFlash/xsDotFlash";
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomNoDataRow from "../../../components/CustomDataGrid/CustomNoDataRow";
import ConfirmationSwal from "../../../components/Swal/CloseCancelSubmitSwal";

const CashVoucherData = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // PART TO OPEN MODALS
  const OpenNewCashVoucher = () => {dispatch({ type: OPEN_NEWCASHVOUCHER, openNewCashVoucher: true })}
  const OpenVoucherSelection = () => {dispatch({ type: OPEN_VOUCHERSELECTION, openVoucherSelection: true })}
  const OpenSubCodeSelection = () => { voucherStatus === 'CLOSED' ? toast.info('Transaction is already closed.') : dispatch({ type: OPEN_SUBCODESELECTION, openSubcodeSelection: true });}
  const OpenCompanyBranchSelection = () => { voucherStatus === 'CLOSED' ? toast.info('Transaction is already closed.') : dispatch({ type: OPEN_COMPANYBRANCHSELECTION, openCompanyBranchSelection: true })}
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState(false);
  const [loadingPrintBtn, setLoadingPrintBtn] = useState(false);
  // ENDS HERE

  //get data
  const voucherData = useSelector((state) => state.customization.cashvoucherData);
  const ToCancel = useSelector((state) => state.customization.changeSwalEnv);
  //emds here

  //global data
  const { data: branchCompanyData } = useGetBranch();
  const { data: fetchSubCode, isLoading } = useGetSubCodes();
  const { data: cashflowData } = useGetCashFlow();
  const [GridRow, setGridRow] = useState([]);
  //end here

  //STATE VALUE HERER
  //header State Data here
  const [headerValue, setHeaderValue] = useState({
    voucherNumber: '',
    voucherDate: '',
    Explanation: '',
    PayeeName: '',
    PreparedBy: '',
    ApprovedBy: '',
  });
  //ends here

  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [selectedDtlID, setSelectedDtlID] = useState(0);
  const [voucherStatus, setVoucherStatus] = useState('');

  //company state data
  const [CompanyID, setCompanyID] = useState(0);
  const [CompanyCode, setCompanyCode] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  //ends here

  //branch state data
  const [branchID, setBranchID] = useState(0);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  //ends here

  //cashflow state data
  const [selectedCCID, setSelectedCCID] = useState('');
  const [selectedCCName, setSelectedCCName] = useState('');
  //ends here

  // sub code state data
  const [selectedSubCode, setSelectedSubcode] = useState(null);
  const [subCodes, setSubCodes] = useState('');
  const [accTitle, setAccTitle] = useState('');
  const [subCodeLink, setSubCodeLink] = useState('');
  const [Description, setDescription] = useState('');
  // ends here

  //header Debit and Credit Amount
  const [Variance, setVariance] = useState('');
  const [DebitAmountHeader, setDebitAmountHeader] = useState('');
  const [CreditAmountHeader, setCreditAmountHeader] = useState('');
  //ends

  //actual to be input debit and credit
  const [Debit, setDebit] = useState('');
  const [rawDebit, setRawDebit] = useState('');
  const [Credit, setCredit] = useState('');
  const [rawCredit, setRawCredit] = useState('');
  const [Remarks, setRemarks] = useState('');
  //ends here

  //ENDS HERE


  const saveCashVoucherDtl = async  () => {
    if(voucherStatus === 'CLOSED') return toast.info('Transaction is already closed.');
    if(voucherStatus === 'CANCELLED') return toast.info('Transaction is already cancelled.');
    if(!headerValue.voucherNumber) return toast.info('Nothing to submit.');
    if(!subCodes) return toast.error('Sub Code is Required!');
    const formattedDate = headerValue.voucherDate ? dayjs(headerValue.voucherDate).format('YYYY-MM-DD') : null;
    const formattedMonth = headerValue.voucherDate ? dayjs(headerValue.voucherDate).format('MMMM').toUpperCase() : null;
    const formattedYear = headerValue.voucherDate ? dayjs(headerValue.voucherDate).format('YYYY') : null;
    const seriesNoParts = headerValue.voucherNumber.split('-');
    const suffix = seriesNoParts.length > 1 ? seriesNoParts[1] : '';
    const CashvoucherData = { 
      CVDSerieslink: headerValue.voucherNumber, 
      CVDHdrIDLink: suffix, 
      CVDAcctCode_D: subCodes, 
      CVDAcctTitle_D: accTitle, 
      CVDAcctSubCode_D: subCodeLink, 
      CVDDescription_D: Description,
      CVDAcct_Amount_D: rawDebit,
      CVDAcctCode_C: subCodes, 
      CVDAcctTitle_C: accTitle, 
      CVDAcctSubCode_C: subCodeLink, 
      CVDDescription_C: Description, 
      CVDAcct_Amount_C: rawCredit, 
      Branch: branchName, 
      BranchID: branchID, 
      BranchCode: branchCode, 
      Company: CompanyName, 
      CompanyID: CompanyID, 
      CompanyCode: CompanyCode, 
      Month: formattedMonth, 
      Year: formattedYear, 
      Date: formattedDate, 
      CFGIDLink: selectedCCID, 
      CFGName: selectedCCName,
      id: selectedDtlID,
    };
    setLoadingSubmitBtn(true);
    try {
      await AddNewCashVoucherDtl.mutateAsync(CashvoucherData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    } finally {
      setLoadingSubmitBtn(false);
    }
  };
  const AddNewCashVoucherDtl = useMutation({
    mutationFn: (CashvoucherData) => http.post('/new-cashvoucherdtl', CashvoucherData),
    onSuccess: (response) => {
      if (response.data.message === "Voucher has been saved. Debit and Credit are balanced.") {
        toast.info('Debit and Credit are balanced.');
        cashVoucherDtl(headerValue.voucherNumber);
        OnSubmitClearData(); 
      } else if (response.data.message === "Credit entries must not exceed the current debit amount.") {
        OnSubmitClearData();
        return toast.error('Credit entries must not exceed the current debit amount.');
      } else if (response.data.message === "The Debit and Credit amounts are already balanced.") {
        OnSubmitClearData();
        return toast.error('The Debit and Credit amounts are already balanced.');
      } else {
        toast.success('Data has been saved.');
        queryClient.resetQueries('cashvoucher_dtl');
        OnSubmitClearData()
      }
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  const deleteVoucherLineDetails = useMutation({
    mutationFn: (id) => http.delete('/delete-cashvoucher', { data: { id } }),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      cashVoucherDtl(headerValue.voucherNumber)
    }
  });
  
  const DeleteData = () => {
    deleteVoucherLineDetails.mutate(selectedToDelete);
  };


  const CancelCashVoucher = async () => {
    try {
      const response = await http.post(`/cancel-cashvoucherhdr?SeriesNo=${headerValue.voucherNumber}`);
      if (response.status === 200 || response.data.success) {
        toast.success('Cash voucher has been cancelled.');
        cashVoucherDtl(headerValue.voucherNumber);
        dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: false })
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit check issuance');
    }
  };


  const CloseCashVoucher = async () => {
    try {
      const response = await http.post(`/close-cashvoucherhdr?SeriesNo=${headerValue.voucherNumber}`);
      if (response.status === 200 || response.data.success) {
        toast.success('Cash voucher has been closed.');
        cashVoucherDtl(headerValue.voucherNumber);
        dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: false })
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit check issuance');
    }
  };

  const PrintCashVoucherForm = async () => {
    if (!headerValue.voucherNumber) return toast.info('Nothing to print.');
    setLoadingPrintBtn(true);
    try {
      const response = await http.get('/print-cashvoucher', {
        params: {
          SeriesNo: headerValue.voucherNumber,
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
      setLoadingPrintBtn(false);
    }
  };

  const cashVoucherDtl = useCallback(async (seriesNo) => {
    try {
      const response = await http.get(`/cashvoucher-dtl` , { params: { SeriesNo: seriesNo } });
      const constMappedData = response.data.map((row, index) => {
        return { ...row, id: row.CVDtlID || index };
      });
      const data = response.data;
      setDebitAmountHeader(data[0].TotalAmtIssued_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
      setCreditAmountHeader(data[0].TotalAmtIssued_C.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
      setVariance(data[0].AmountVariance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
      setVoucherStatus(data[0].Status || '');
      setGridRow(constMappedData)
    } catch (error) {
      console.error(error);
    }
  }, []);

  //USEEFFECT SECTIONS HERE'

  useEffect(() => {
    setHeaderValue((prevData) => ({
      ...prevData,
      ...(voucherData ? {
        voucherNumber: voucherData.SeriesNo || '',
        voucherDate: voucherData.Date ? dayjs(voucherData.Date).format('YYYY-MM-DD') : '' || '',
        Explanation: voucherData.Explanation || '',
        PayeeName: voucherData.PayeeName || '',
        PreparedBy: voucherData.PreparedBy || '',
        ApprovedBy: voucherData.ApprovedBy || '',
      } : {}), 
    }));
    if(selectedSubCode){
      setSubCodes(selectedSubCode?.ChASubCode || '')
      setDescription(selectedSubCode?.ChADetails || '');
      setAccTitle(selectedSubCode?.ChAMName || '');
      setSubCodeLink(selectedSubCode?.ChAMCodeLink || '');
    }
    setCompanyID(branchCompanyData?.length > 0 ? branchCompanyData[0].CompID : '' || '');
    setCompanyCode(branchCompanyData?.length > 0 ? branchCompanyData[0].CompCode : '' || '');
    setCompanyName(branchCompanyData?.length > 0 ? branchCompanyData[0].CompName : '' || '');
    setBranchName(branchCompanyData?.length > 0 ? branchCompanyData[0].BrName : '' || '');
    setBranchCode(branchCompanyData?.length > 0 ? branchCompanyData[0].BrCode : '' || '');
    setBranchID(branchCompanyData?.length > 0 ? branchCompanyData[0].BrID : '' || '');
    if (voucherData?.SeriesNo) {
      cashVoucherDtl(voucherData.SeriesNo);
    }
  }, [voucherData, branchCompanyData, selectedSubCode, cashVoucherDtl]);


  //ENDS HERE

  const ToUpdateCashvoucherData = () => {
    if(!headerValue.voucherNumber) return toast.info('Nothing to edit.')
    dispatch({type: IS_UPDATECASHVOUCHER, isUpdateCashVoucher: true});
    dispatch({type: CASHVOUCHER_DATA, cashvoucherData: voucherData});
    dispatch({type: OPEN_NEWCASHVOUCHER, openNewCashVoucher: true});
  }

  const uniqueSubCodes = fetchSubCode ? Array.from(new Set(fetchSubCode.map((subCode) => subCode))) : [];
  const handleAutocompleteChange = (event, newValue) => {
    setSelectedSubcode(newValue);
  };

  const handleChangeSelect = (event) => {
    const [CCID, CCName] = event.target.value.split('|');
    setSelectedCCID(CCID);
    setSelectedCCName(CCName);
  };

  const SelectedSubCodeData = (data) => {
    setSelectedSubcode(data);
  }

  const SelectedCompanyBranchData = (data) => {
    setCompanyName(data.CompName);
    setCompanyID(data.CompID);
    setCompanyCode(data.CompCode);
    setBranchID(data.BrID);
    setBranchName(data.BrName)
    setBranchCode(data.BrCode);
  }

  const formatNumberWithCommas = (number) => {
    return number
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const DebitTextFieldChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    setRawDebit(value);
    const formattedValue = formatNumberWithCommas(value);
    setDebit(formattedValue);
    if (value) {
      setCredit('');
    }
  };

  const CreditTextFieldChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    setRawCredit(value)
    const formattedValue = formatNumberWithCommas(value);
    setCredit(formattedValue);
    if (value) {
      setDebit('');
    }
  };

  const OnSubmitClearData = () => {
    setCredit('');
    setDebit('');
    setRawCredit(''); 
    setRawDebit('');
    setRemarks('');
    setSubCodes('');
    setDescription('');
    setAccTitle('');
    setSubCodeLink('');
    setSelectedSubcode();
  }

  const NewTransaction = () => {
    dispatch({type: CASHVOUCHER_DATA, cashvoucherData: {}});
    setGridRow([]);
    setCreditAmountHeader('');
    setDebitAmountHeader('');
    setVariance('');
    setVoucherStatus('');
    OnSubmitClearData();
  }

  const CancelTransaction = () => {
    dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: true});
    dispatch({ type: CHANGE_SWAL_ENV, changeSwalEnv: true});
  }

  const CloseTransaction = () => {
    dispatch({ type: OPEN_SWALCONFIRMATION, swalConfirmation: true});
    dispatch({ type: CHANGE_SWAL_ENV, changeSwalEnv: false});
  }


  const ColumnHeader = [
    { field: 'CVDAcctCode_D', headerName: 'Particulars', width: 330,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.CVDAcctCode_D !== null && params.row.CVDAcctCode_D !== ''
        ? `${params.row.CVDAcctCode_D} ${params.row.CVDAcctCode_D === '' ? '' : '/'} ${params.row.BranchCode} ${params.row.CVDAcctCode_D === '' ? '' : '-'} ${params.row.CVDDescription_D}` 
        : `${params.row.CVDAcctCode_C} ${params.row.CVDAcctCode_C === '' ? '' : '/'} ${params.row.BranchCode} ${params.row.CVDAcctCode_C === '' ? '' : '-'} ${params.row.CVDDescription_C}`}
        </Box>
      ),
    },
    { field: 'CVDAcct_Amount_D', headerName: 'Debit', width: 150,
      renderCell: (params) => (
        <Box sx={{background: 'orange', paddingLeft:.5}}>
          {params.row.CVDAcct_Amount_D === 0 ? '' : `₱ ${params.row.CVDAcct_Amount_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        </Box>    
      ),
    },
    { field: 'CVDAcct_Amount_C', headerName: 'Credit', width: 150,
      renderCell: (params) => (
        <Box sx={{background: 'red', paddingLeft:.5}}>
          {params.row.CVDAcct_Amount_C === 0 ? '' : `₱ ${params.row.CVDAcct_Amount_C.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        </Box>    
      ),
    },
    { field: 'Company', headerName: 'Company/Branch', width: 400,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
         {`${params.row.Company} / ${params.row.Branch}`}
        </Box>
      ),
    },
    { field: 'CFSGName', headerName: 'Charge To', width: 130,},
    { field: 'CVRemarks', headerName: 'Remarks', flex:1,},
    { field: "actions", headerAlign: 'right',
      headerName: '',    
      width: 200,
      align: 'right',
      renderCell: (params) => {
      const selectedToEdit = () => {
          setSelectedDtlID(params.row.CVDtlID);
          setDescription(params.row.CVDDescription_C || params.row.CVDDescription_D);
      }
      return (
        <Box sx={{paddingRight:1}}>
          {selectedToDelete === params.row.CVDtlID  ? (
            <Grow in={true}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{display: 'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                <Typography fontSize={9} fontWeight={700}>
                    Are you sure you want to delete this data?
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap:1, justifyContent:'flex-end' }}>
              <Button size="small" variant="contained" color="primary" onClick={DeleteData}>
                  Confirm
              </Button>
              <Button size="small" variant="contained" color="error" onClick={() => setSelectedToDelete(!selectedToDelete)}>
                  Cancel
              </Button>     
              </Box>
            </Box>
            </Grow>
          ) : (
            <Box sx={{ textAlign: 'right', marginLeft: '80px' }}>
               {voucherStatus === 'CLOSED' ? 
                ''
               : 
               <>
               <IconButton color="primary" size="small" onClick={selectedToEdit}>
                    <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton color="error" size="small" onClick={() => setSelectedToDelete(params.row.CVDtlID)}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton> 
               </>   
              } 
            </Box>   
          )}
        </Box>
      )
      }
    }
  ];
  

  return (
    <Fragment>
        <NewCashVoucher />
        <CashVoucherSelection />
        <SubCodeSelection Dataobj={SelectedSubCodeData} />
        <CompanyBranchSelection Dataobj={SelectedCompanyBranchData} /> 
        <ConfirmationSwal maxWidth="xs" onClick={ToCancel ? CancelCashVoucher : CloseCashVoucher} />
        <Paper>
            <Stack sx={{
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                alignItems: {xs: '', md: 'center'},
                padding:1,
                gap: {xs: 1}
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection:{ sx:'column', md: 'row' }, gap: 1, alignItems:'center' }}>
                    <Button variant="contained" size="large" onClick={ToUpdateCashvoucherData}>Edit Cash Voucher Entry</Button>
                    <Button variant="contained" size="large" color="info">AUDIT LOGS</Button>
                    {voucherStatus === '' ? '' : 
                      <Grow in={true}>
                        <Chip label={voucherStatus} 
                      color={
                        voucherStatus === 'ACTIVE' ? 'info' : 
                        voucherStatus === 'SUBMITTED' ? 'primary' :
                        voucherStatus === 'CANCELLED' ? 'error' :
                        'warning'
                      }
                      size="large" 
                      />
                      </Grow>
                      }
                </Box>
                <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: {xs:'column', md: 'row'}, gap:1}}>
                    <TextField value={Variance} disabled onChange={(e) => {setVariance(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'RED '},  }} variant="standard" label="VARIANCE" size="small" placeholder="0.00" InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                    }} />
                    <TextField disabled  sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '},  }} value={DebitAmountHeader} onChange={(e) => {setDebitAmountHeader(e.target.value)}} variant="standard" label="DEBIT AMOUNT" size="small" placeholder="0.00" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                    <TextField disabled sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '}, }} value={CreditAmountHeader} onChange={(e) => {setCreditAmountHeader(e.target.value)}} variant="standard" label="CREDIT AMOUNT" placeholder="0.00" size="small" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                </Box>
            </Stack>
            <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                    <FormControl variant="filled" fullWidth>
                      <InputLabel>Voucher Number</InputLabel>
                      <FilledInput size="small"
                        disabled
                        label="Voucher Number"
                        value={headerValue.voucherNumber}
                        onChange={(e) =>
                          setHeaderValue({ ...headerValue, voucherNumber: e.target.value })
                        }
                        endAdornment={
                          <InputAdornment position="end">
                              <Button size="small" variant="contained" onClick={OpenVoucherSelection} ><SearchIcon /></Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Voucher Date" disabled variant="filled" fullWidth size="small" value={headerValue.voucherDate} onChange={(e) => setHeaderValue({ ...headerValue, voucherDate: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="Explanation" disabled variant="filled" fullWidth size="small" value={headerValue.Explanation} onChange={(e) => setHeaderValue({ ...headerValue, Explanation: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="Payee" disabled variant="filled" fullWidth size="small" value={headerValue.PayeeName} onChange={(e) => setHeaderValue({ ...headerValue, PayeeName: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="Prepared by" disabled variant="filled" fullWidth size="small" value={headerValue.PreparedBy} onChange={(e) => setHeaderValue({ ...headerValue, PreparedBy: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="Approved by" disabled variant="filled" fullWidth size="small" value={headerValue.ApprovedBy} onChange={(e) => setHeaderValue({ ...headerValue, ApprovedBy: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField label="Audited by" variant="filled" fullWidth size="small" disabled />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
            <CustomDataGrid 
                gridOverLay={'100px'}
                height={200}
                columns={ColumnHeader}
                rows={GridRow}
                slots={{ noRowsOverlay: CustomNoDataRow }}
                hideFooter
              />
            </Box>
            <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
            <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                        <FormControl variant="filled" fullWidth>
                        <InputLabel>Company</InputLabel>
                        <FilledInput size="small"
                            endAdornment={
                            <InputAdornment position="end">
                                <Button size="small" variant="contained" onClick={OpenCompanyBranchSelection}><SearchIcon /></Button>
                            </InputAdornment>
                            }
                            disabled
                            label="Company"
                            value={CompanyName}
                            onChange={(e) => {setCompanyName(e.target.value)}}
                        />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>     
                    <Autocomplete
                        freeSolo
                        options={uniqueSubCodes}
                        loading={isLoading}
                        getOptionLabel={(option) => option.ChASubCode || ""}
                        noOptionsText={isLoading ? "Loading..." : "No data found"}
                        value={selectedSubCode}
                        isOptionEqualToValue={(option, value) => option.ChASubCode === value.ChASubCode} 
                        onChange={handleAutocompleteChange}
                        disabled={voucherStatus === 'CLOSED' ? true : false}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                              size="small"
                              label="Sub Code"
                              InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                {isLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : (
                                  <>
                                    {params.InputProps.endAdornment}
                                    <InputAdornment position="end">
                                      <Button size="small" variant="contained" sx={{ mb: 2.5 }} onClick={OpenSubCodeSelection}>
                                        <SearchIcon />
                                      </Button>
                                    </InputAdornment>
                                  </>
                                )}
                              </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField variant="filled" size="small" label="Description" fullWidth disabled value={Description} onChange={(e) => {setDescription(e.target.value)}} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField variant="filled" size="small" label="Cash flow" select onChange={handleChangeSelect} SelectProps={{native: true,}} fullWidth>
                        <option></option>
                        {cashflowData?.map((option) => (
                          <option key={option.CCID} value={`${option.CCID}|${option.CCName}`}>
                            {option.CCName}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                    <TextField variant="filled" disabled size="small" label="Branch" fullWidth value={branchName} onChange={(e) => {setBranchName(e.target.value)}} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                    <TextField fullWidth variant="filled" label="DEBIT" size="small" placeholder="0.00" value={Debit} onChange={DebitTextFieldChange} InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }} disabled={Credit !== ''}  />
                    </Grid>
                    <Grid item xs={12} md={2}>
                    <TextField fullWidth variant="filled" label="CREDIT" size="small" placeholder="0.00" value={formatNumberWithCommas(Credit)} onChange={CreditTextFieldChange} InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }} disabled={Debit !== ''}  />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField size="small" variant="filled" label="Remarks" fullWidth value={Remarks} onChange={(e) => {setRemarks(e.target.value)}} />
                    </Grid>
                    {voucherStatus === 'CLOSED' ? '' : voucherStatus === 'CANCELLED' ? '' : 
                    <Grid item xs={12} md={12} lg={12} xl={1.5} sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: '', md: 'center'}, alignItems: {xs: '', md: 'center'}}}>         
                      <CustomLoadingButton
                        btnClick={saveCashVoucherDtl}
                        isDisabled={loadingSubmitBtn}
                        btnVariant="contained"
                        label={loadingSubmitBtn ? <>Loading <Box sx={{ml:1}}><XSDotFlash /></Box></> : 'Submit'}
                        type="submit"
                        btnSize="medium"
                        fullWidth
                      />              
                    </Grid>
                    }
                    <Grid item xs={12} md={12} lg={12} xl={2} sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: '', md: 'center'}, alignItems: {xs: '', md: 'center'}, gap: 1}}>
                      <CustomLoadingButton
                        btnClick={PrintCashVoucherForm}
                        isDisabled={loadingPrintBtn}
                        btnVariant="contained"
                        label={loadingPrintBtn ? <>Printing <Box sx={{ml:1}}><XSDotFlash /></Box></> : 'PRINT Cash Voucher Form'}
                        type="submit"
                        color="warning"
                        fullWidth
                      /> 
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<CreateNewFolderIcon/>} fullWidth variant="contained" color="info" onClick={OpenNewCashVoucher}>NEW CASH VOUCHER ISSUANCE</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<SearchIcon />} fullWidth variant="contained" color="warning">SEARCH TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<InsertDriveFileIcon/>} fullWidth variant="contained" color="secondary" onClick={NewTransaction}>NEW TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<FormatClearIcon />} fullWidth variant="contained" color="error" onClick={OnSubmitClearData}>CLEAR ENTRY</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2}>
                      <Button startIcon={<DeleteForeverIcon />} color="error" fullWidth variant="contained" onClick={CancelTransaction}>CANCEL CV TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<BackupIcon />} fullWidth variant="contained" onClick={CloseTransaction}>CLOSE CASH VOUCHER ISSUANCE</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    </Fragment>
  )
}

export default CashVoucherData