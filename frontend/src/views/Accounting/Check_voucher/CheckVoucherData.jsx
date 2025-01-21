import { Autocomplete, Box, Button, Chip, CircularProgress, FilledInput, FormControl, Grid, Grow, IconButton, InputAdornment, InputLabel, Paper, Stack, TableCell, TableRow, TextField, Typography } from "@mui/material"
import CustomTable from "../../../components/CustomDataTable"
import TableHeader from "../../../components/CustomDataTable/TableHeader"
import CustomHeaderCell from "../../../components/CustomDataTable/CustomHeaderCell"
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BackupIcon from '@mui/icons-material/Backup';
import PrintIcon from '@mui/icons-material/Print';
import { Fragment, useCallback, useEffect, useState } from "react";
import NewCheckVoucher from "./NewCheckVoucher";
import { toast } from "sonner";
import http from "../../../api/http";
import dayjs from 'dayjs'
import UpdateVoucher from "./UpdateCheckVoucjer";
import VoucherSelection from "./VoucherSelection";
import { useMutation } from "@tanstack/react-query";
import AddSubCode from "./AddSubCode";
import AddCompanyBranch from "./AddCompanyBranch";
import CustomTableBody from "../../../components/CustomDataTable/TableBody";
import LoadingData from "../../../components/CustomDataTable/LoadingData";
import CustomTableBodyCell from "../../../components/CustomDataTable/CustomTableBodyCell";
import NoData2 from "../../../components/CustomDataTable/NoData2";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VerifySwal from "../../../components/VerifySwal";
import SearchCheckVoucher from "./SearchCheckVoucher";
import IssueCheck from "./IssueCheck";
import CustomLoadingButton from "../../../components/CustomLoadingButton";
import XSDotFlash from "../../../components/DotFlash/xsDotFlash";
import VerifyPeriodStatus from "../../../components/VerifySwal/ActivateAndDeactivate";
import ViewLogs from "./ViewLogs";
import { useGetCashFlow, useGetSubCodes } from "../../../hooks/globalQuery";


  // IN THIS COMPONENT PLEASE DONT FOLLOW THIS METHOD THIS IS BAD PRACTICE


  const CheckVoucherData = () => {
    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingBtnInitial] = useState(false);
    const [openNewVoucher, setOpenNewVoucher] = useState(false);
    const [loadingIssueBtn, setLoadingIssueBtn] = useState(false);
    const [openUpdateVoucher, setOpenUpdateVoucher] = useState(false);
    const [openSelectVoucher, setOpenSelectVoucher] = useState(false);
    const [openAddSubCodes, setOpenAddSubCodes] = useState(false);
    const [openAddCompanyBranch, setOpenAddCompanyBranch] = useState(false);
    const [openDeleteSwal, setopenDeleteSwal] = useState(false);
    const [openConfirmSwal, SetOpenConfirmSwal] = useState(false);
    const [openCancelConfirmSwal, SetOpenCancelConfirmSwal] = useState(false);
    const [openSearchVoucher, setOpenSearchVoucher] = useState(false);
    const [openCheckIssuance, setOpenCheckIssuance] = useState(false);
    const [openViewLogs, setOpenViewLogs] = useState(false);
    const [loadingtwo, setLoadingtwo] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loadingBtnTwo, setLoadingBtnTwo] = useState(false);
    const openNewVoucherModal = () => {setOpenNewVoucher(true)}
    const closeNewVoucherModal = () => {setOpenNewVoucher(false)}
    const openViewLogsModal = () => {setOpenViewLogs(true)}
    const closeViewLogsModal = () => {setOpenViewLogs(false)}
    const openUpdateVoucherModal = () => {setOpenUpdateVoucher(true)}
    const closeUpdateVoucherModal = () => {setOpenUpdateVoucher(false)}
    const openSelectVoucherModal = () => {setOpenSelectVoucher(true)}
    const closeSelectVoucherModal = () => {setOpenSelectVoucher(false)}
    const openSubCodeModal = () => { 
      if(voucherStatus === 'CLOSED') return toast.error('Closed Transaction. Cannot Re-close.');
      setOpenAddSubCodes(true)
    }
    const closeSubCodeModal = () => {setOpenAddSubCodes(false)}
    const openAddCompanyBranchModal = () => {
      if(voucherStatus === 'CLOSED') return toast.error('Closed Transaction. Cannot Re-close.');
      setOpenAddCompanyBranch(true) 
    }
    const closeAddCompanyBranchModal = () => {setOpenAddCompanyBranch(false)}
    const confirmDeletion = () => {setopenDeleteSwal(true)}
    const cancelDeletion = () => {setopenDeleteSwal(false), setSelectedID('')}
    const confirmChange = () => {SetOpenConfirmSwal(true)}
    const cancelChange = () => {SetOpenConfirmSwal(false)}
    const confirmCancelChange = () => {SetOpenCancelConfirmSwal(true)}
    const CloseCancelChange = () => {SetOpenCancelConfirmSwal(false)}
    const openSearchVoucherModal = () => {setOpenSearchVoucher(true) }
    const closeSearchVoucherModal = () => {setOpenSearchVoucher(false)}
    const closeCheckIssuanceModal = () => {setOpenCheckIssuance(false)}


    //variables and data
    const [Data, setAllData] = useState({})
    const [editVoucherData, setEditVoucherData] = useState(null);
    const [newVoucherData, setNewVoucherData] = useState({});
    const [updatedVoucherData, setUpdatedVoucherData] = useState({});
    const [voucherDetails, setVoucherDetails] = useState({});
    const [datatwo, setDataTwo] = useState([]);
    const [CreditAmount, setCreditAmount] = useState('');
    const [DebitAmount, setDebitAmount] = useState('');

    //1st line
    const [voucherStatus, setVoucherStatus] = useState('');
    const [selectedID, setSelectedID] = useState(0);
    const [idLink, setIdLink] = useState(0)
    const [VoucherNumber, setVouherNumber] = useState('');
    const [VoucherDate, setVoucherDate] = useState('');
    const [VoucherPayee, setVoucherPayee] = useState('');
    const [VoucherExplanation, setVoucherExplanation] = useState('');

    //2nd line
    const [subCodes, setSubCodes] = useState('');
    const [subAccTitle, setSubAccTitle] = useState('');
    const [subAccMainCode, setSubAccMainCode] = useState('');
    const [CompanyIDs, setCompanyIDs] = useState('');
    const [CompanyCodes, setCompanyCodes] = useState('');
    const [Company, setCompany] = useState('');
    const [BranchIDs, setBranchID] = useState(0)
    const [Branches, setBranch] = useState('');
    const [BranchCodes, setBranchCodes] = useState('');
    const [Debit, setDebit] = useState('');
    const [Credit, setCredit] = useState('');
    const [bankRefId, setBankRefId] = useState(0);
    const [Description, setDescription] = useState('');
    const [Remarks, setRemarks] = useState('');
    const [selectedCCID, setSelectedCCID] = useState('');
    const [selectedCCName, setSelectedCCName] = useState('');
    const [TotalCheckAmount, setTotalCheckAmount] = useState('');
    const [Variance, setVariance] = useState('');

    const newVoucherDetails = () => {
      if(!VoucherNumber) return toast.error('No transaction to be submitted');
      if(voucherStatus === 'CANCELLED') return toast.error('Cannot re-submit a cancelled checked');
      if(voucherStatus === 'CLOSED') return toast.error('Closed Transaction. Cannot Re-close.');
      const formattedDate = VoucherDate ? dayjs(VoucherDate).format('YYYY-MM-DD') : null;
      const formattedMonth = VoucherDate ? dayjs(VoucherDate).format('MMMM').toUpperCase() : null;
      const formattedYear = VoucherDate ? dayjs(VoucherDate).format('YYYY') : null;
      const voucherData = {
        CVDSerieslink:VoucherNumber, 
        CVDHdrIDLink: idLink, 
        CVDAcctCode_D: subAccMainCode, 
        CVDAcctTitle_D: subAccTitle, 
        CVDAcctSubCode_D: subCodes,
        CVDDescription_D: Description, 
        CVDAcct_Amount_D:Debit, 
        CVDAcctCode_C: subAccMainCode, 
        CVDAcctTitle_C: subAccTitle, 
        CVDAcctSubCode_C: subCodes,
        CVDDescription_C: Description, 
        CVDAcct_Amount_C:Credit, 
        Branch:Branches, 
        BranchID: BranchIDs, 
        BranchCode:BranchCodes, 
        Company: Company,
        CompanyID: CompanyIDs, 
        CompanyCode: CompanyCodes, 
        Year: formattedYear, 
        Month: formattedMonth, 
        Date: formattedDate, 
        Status: 'ACTIVE', 
        BankRefID: bankRefId,
        CheckDate: formattedDate, 
        CheckMonth: formattedMonth, 
        CheckYear: formattedYear,
        ChargeTo: selectedCCName, 
        ChargeToID: selectedCCID, 
        CVRemarks: Remarks
      };
      addNewCheckVoucherDetails.mutate(voucherData);
    };
    const addNewCheckVoucherDetails = useMutation({
      mutationFn: (voucherData) => http.post('/new-checkvoucherdtls', voucherData),
      onSuccess: (response) => {
        if (response.data.message === "Voucher has been saved. Debit and Credit are balanced.") {
          voucherDetailsMain(idLink);
          getCreditAmount(VoucherNumber);
          getVariance(VoucherNumber);
          toast.info('Debit and Credit are balanced.');
          clearData();
        } else {
          toast.success('Data has been saved.');
          voucherDetailsMain(idLink);
          getCreditAmount(VoucherNumber);
          clearData();
        }
      },
      onError: (error) => {
        toast.error(error)
      }
    });

    const UpdateVoucherDetails = () => {
      const formattedDate = VoucherDate ? dayjs(VoucherDate).format('YYYY-MM-DD') : null;
      const formattedMonth = VoucherDate ? dayjs(VoucherDate).format('MMMM').toUpperCase() : null;
      const formattedYear = VoucherDate ? dayjs(VoucherDate).format('YYYY') : null;
      const voucherData = {
        id: selectedID,
        CVDSerieslink:VoucherNumber, 
        CVDHdrIDLink: idLink, 
        CVDAcctCode_D: subCodes, 
        CVDAcctTitle_D: subAccTitle, 
        CVDAcctSubCode_D: subAccMainCode,
        CVDDescription_D: Description, 
        CVDAcct_Amount_D:Debit, 
        CVDAcctCode_C: subCodes, 
        CVDAcctTitle_C: subAccTitle, 
        CVDAcctSubCode_C: subAccMainCode,
        CVDDescription_C: Description, 
        CVDAcct_Amount_C:Credit, 
        Branch:Branches, 
        BranchID: BranchIDs, 
        BranchCode:BranchCodes, 
        Company: Company,
        CompanyID: CompanyIDs, 
        CompanyCode: CompanyCodes, 
        Year: formattedYear, 
        Month: formattedMonth, 
        Date: formattedDate, 
        Status: 'ACTIVE', 
        BankRefID: bankRefId,
        CheckDate: formattedDate, 
        CheckMonth: formattedMonth, 
        CheckYear: formattedYear,
        ChargeTo: selectedCCName, 
        ChargeToID: selectedCCID, 
        CVRemarks: Remarks
      };
      UpdateCheckVoucherDetails.mutate(voucherData);
    };
    const UpdateCheckVoucherDetails = useMutation({
      mutationFn: (voucherData) => http.post('/new-checkvoucherdtls', voucherData),
      onSuccess: (response) => {
        if (response.data.message === "Voucher has been saved. Debit and Credit are balanced.") {
          voucherDetailsMain(idLink);
          getCreditAmount(VoucherNumber);
          getVariance(VoucherNumber);
          clearData();
        } else {
          toast.success('Data has been updated.');
          voucherDetailsMain(idLink);
          getCreditAmount(VoucherNumber);
          clearData();
        }
      },
      onError: (error) => {
        toast.error(error)
      }
    });


    const getVariance = useCallback(async (seriesNo) => {
      try {
        const response = await http.get('/amount-variance', { params: { SeriesNo: seriesNo, CVDSerieslink: seriesNo } });
        const data = response.data;
        setVariance(data[0].difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '' || '');
        return response.data
      } catch (error) {
        console.error(error);
        toast.error('Connection failed!');
      }
    }, []);
    


    //get functions data
    const getNewVoucherData = (data) => {
      setNewVoucherData(data)
      clearData();
    }

    const getUpdatedVoucherData = (data) => {
      setUpdatedVoucherData(data)
    }

    const getSelectedVoucherData = (data) => {
      setVouherNumber(data.SeriesNo);
      getCheckVoucherDetails(data.SeriesNo);
      getIssuanceData(data.SeriesNo)
      voucherDetailsMain(data.ID);
      getCreditAmount(data.SeriesNo);
      getVariance(data.SeriesNo);
      setIdLink(data.ID);
      clearData()
    }

    const getSearchCheckVoucher = (data) => {
      setVouherNumber(data.SeriesNo);
      getCheckVoucherDetails(data.SeriesNo);
      getIssuanceData(data.SeriesNo)
      voucherDetailsMain(data.ID);
      getCreditAmount(data.SeriesNo);
      getVariance(data.SeriesNo);
      setIdLink(data.ID);
      clearData();
    }

    const getSubCodesData = (data) => {
      setSubCodes(data.ChASubCode);
      setSubAccTitle(data.ChAMName);
      setSubAccMainCode(data.ChAMCodeLink);
      setDescription(data.ChADetails);
      setBankRefId(data.BankRefID);
    }

    const getCompanyBranchData = (data) => {
      setCompany(data.CompName);
      setBranch(data.BrName);
      setCompanyIDs(data.CompID);
      setCompanyCodes(data.CompCode);
      setBranchID(data.BrID);
      setBranchCodes(data.BrCode);
    }

    const { data: fetchSubCode, isLoading } = useGetSubCodes();
    const uniqueSubCodes = fetchSubCode ? Array.from(new Set(fetchSubCode.map((subCode) => subCode.ChASubCode))) : [];
    const { data: cashflowData } = useGetCashFlow();

    const getCheckVoucherDetails = useCallback(async (seriesNo) => {
      try {
        const response = await http.get(`/checkvoucher-details?SeriesNo=${seriesNo || VoucherNumber}`);
        const { data } = response;
        setAllData(data[0]);
        setVoucherDate(dayjs(data[0].Date).format('YYYY-MM-DD') || '');
        setVoucherPayee(data[0].PayeeName || '');
        setVoucherExplanation(data[0].Explanation || '');
        setVoucherStatus(data[0].Status);
      } catch (error) {
        console.error(error);
        toast.error('Connection failed!');
      }
    }, [VoucherNumber]);

    const getIssuanceData = useCallback(async (seriesNo) => {
      setLoadingtwo(true)
      try {
        const response = await http.get('/checkissued-details', { params: { CheckSeriesNo: seriesNo || VoucherNumber } });
        const { details, totalAmount } = response.data;
        setDataTwo(details);
        setTotalCheckAmount(totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
      } catch (error) {
        console.error(error);
        toast.error('Connection failed!');
      } finally {
        setLoadingtwo(false)
      }
    }, [VoucherNumber]);

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

    const getDefaultBranch = useCallback(async () => {
      try {
        const response = await http.get('/defaultbranch-details');
        setBranch(response.data[0].BrName);
        setBranchCodes(response.data[0].BrCode);
        setBranchID(response.data[0].BrID);
        setCompany(response.data[0].CompName);
        setCompanyIDs(response.data[0].CompID);
        setCompanyCodes(response.data[0].CompCode);
      } catch (error) {
        console.error(error);
      }
    }, []);

    useEffect(() => {
      if (newVoucherData && newVoucherData.SeriesNo) {
        setVouherNumber(newVoucherData.SeriesNo);
        getCheckVoucherDetails(newVoucherData.SeriesNo);
        getIssuanceData(newVoucherData.SeriesNo);
        const seriesNoParts = newVoucherData.SeriesNo.split('-');
        const suffix = seriesNoParts.length > 1 ? seriesNoParts[1] : '';   
        voucherDetailsMain(suffix);
        getVariance(newVoucherData.SeriesNo);
        getCreditAmount(newVoucherData.SeriesNo);
        setIdLink(suffix);
      } else if (updatedVoucherData && updatedVoucherData.SeriesNo) {
        setVouherNumber(updatedVoucherData.SeriesNo);
        getCheckVoucherDetails(updatedVoucherData.SeriesNo);
        getIssuanceData(updatedVoucherData.SeriesNo);
        const seriesNoParts = updatedVoucherData.SeriesNo.split('-');
        const suffix = seriesNoParts.length > 1 ? seriesNoParts[1] : '';
        voucherDetailsMain(suffix);
        getVariance(updatedVoucherData.SeriesNo);
        getCreditAmount(updatedVoucherData.SeriesNo);
        setIdLink(suffix);
      } else {
        getDefaultBranch();
      }
    }, [newVoucherData, updatedVoucherData, getCheckVoucherDetails, getIssuanceData, getDefaultBranch, getCreditAmount, getVariance]);


    const voucherDetailsMain = async (ID) => {
      setLoading(true)
      try {
        const response = await http.get(`/mainvoucher-details`, { params: { id: ID } })
        const { data } = response;
        if (data && data.length > 0) {
          setVoucherDetails(data);
          setDebitAmount(data[0].TotalAmtIssued_D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '');
        } else {
          setVoucherDetails([]);
          setDebitAmount('');
          setCreditAmount('');
        }
      } catch (error) {
        console.error(error)
        toast.error('Connection failed!')
      } finally {
        setLoading(false)
      }
    }


    const deleteVoucherLineDetails = useMutation({
      mutationFn: (id) => http.delete('/delete-checkvoucher', { data: { id } }),
      onSuccess: () => {
        toast.success('Data has been deleted successfully.');
        voucherDetailsMain(idLink);
      }
    });
    
    const DeleteData = () => {
      deleteVoucherLineDetails.mutate(selectedID);
      cancelDeletion();
    };


    const PrintInitalCV = async () => {
      if (!VoucherNumber) return toast.info('Nothing to print preview');
      setLoadingBtnInitial(true);
      try {
        const response = await http.get('/printinitial-cv', {
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
      } finally {
        setLoadingBtnInitial(false);
      }
    };


    const PrintCheckVoucher = async () => {
      if (!VoucherNumber) return toast.info('Nothing to print preview');
      setLoadingBtnTwo(true);
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
      } finally {
        setLoadingBtnTwo(false);
      }
    };


    const SubmitCheckIssuance = async () => {
      try {
        const response = await http.post(`/submit-checkvoucher?SeriesNo=${VoucherNumber}`);
        if (response.status === 200 || response.data.success) {
          toast.success('Check issuance submitted successfully!');
          getCheckVoucherDetails(VoucherNumber);
          cancelChange();
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to submit check issuance');
      }
    };

    const ChangeStatusToIssue = async () => {
      if (voucherStatus === 'CANCELLED') return toast.error('Accounting entry already cancelled!');
      if (DebitAmount !== CreditAmount) return toast.error('Debit and Credit should be balance in order to issue check!');
      if (!VoucherNumber) return toast.info('Nothing to Issue');
      setLoadingIssueBtn(true);
      try {
        const response = await http.post(`/submit-checkvoucher?SeriesNo=${VoucherNumber}`);
        if (response.status === 200 || response.data.success) {
          getCheckVoucherDetails(VoucherNumber);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to submit check issuance');
      } finally {
        setLoadingIssueBtn(false);
        setOpenCheckIssuance(true);
      }
    };
    


    const CancelCheckIssuance = async () => {
      try {
        const response = await http.post(`/cancel-checkvoucher?SeriesNo=${VoucherNumber}`);
        if (response.status === 200 || response.data.success) {
          toast.success('Check issuance cancelled successfully!');
          getCheckVoucherDetails(VoucherNumber);
          CloseCancelChange();
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to submit check issuance');
      }
    };

    
    const editVoucher = (voucher) => {
      if(!VoucherNumber) return toast.info('No voucher data to edit')
      setEditVoucherData(voucher);
      openUpdateVoucherModal();
    }

    const handleAutocompleteChange = (event, newValue) => {
      setSubCodes(newValue);
    };

    const handleChangeSelect = (event) => {
      const [CCID, CCName] = event.target.value.split('|');
      setSelectedCCID(CCID);
      setSelectedCCName(CCName);
    };

    const editData = (data) => {
      setIsEditMode(true);
      setSelectedID(data.CVDtlID)
      setSubCodes(data.CVDAcctCode_D || data.CVDAcctCode_C);
      setSubAccTitle(data.CVDAcctTitle_D || data.CVDAcctTitle_C);
      setSubAccMainCode(data.CVDAcctSubCode_D || data.CVDAcctSubCode_C);
      setDescription(data.CVDDescription_D || data.CVDDescription_C);
      setDebit(data.CVDAcct_Amount_D || '');
      setCredit(data.CVDAcct_Amount_C || '');
      setBranch(data.Branch);
      setBranchID(data.BranchID);
      setBranchCodes(data.BranchCodes);
      setCompany(data.Company);
      setCompanyIDs(data.CompanyID);
      setCompanyCodes(data.CompanyCodes);
      setBankRefId(data.BankRefID); 
      setSelectedCCID(data.ChargeToID);
      setSelectedCCName(data.ChargeTo);
      setSelectedID(data.CVDtlID);
      setRemarks(data.CVRemarks);
    }

    const clearData = () => {
      setSubCodes('');
      setSubAccTitle('');
      setSubAccMainCode('');
      setDescription('');
      setDebit('');
      setCredit('');
      // setBranch('');
      // setBranchID(0);
      // setBranchCodes('');
      // setCompany('');
      // setCompanyIDs('');
      // setCompanyCodes('');
      setBankRefId(0);  
      setRemarks('');
      setIsEditMode(false);
    }

    const NewEntry = () => {
      if (!VoucherNumber) return;
      setAllData([]);
      setVoucherDetails([]);
      setVouherNumber('');
      setVoucherDate('');
      setVoucherPayee('');
      setVoucherExplanation('');
      setSubCodes('');
      setSubAccTitle('');
      setSubAccMainCode('');
      setDescription('');
      setDebit('');
      setCredit('');
      setBranch('');
      setBranchID(0);
      setBranchCodes('');
      setCompany('');
      setCompanyIDs('');
      setCompanyCodes('');
      setBankRefId(0);  
      setRemarks('');
      setIsEditMode(false);
      setVoucherStatus('');
      setDebitAmount('');
      setCreditAmount('');
      setVariance('');
      getIssuanceData([]);
      setNewVoucherData([]);
    }

    const handleDelete = (data) => {
      setSelectedID(data.CVDtlID);
      confirmDeletion();
    }

    const handleDebitChange = (e) => {
      const value = e.target.value;
      setDebit(value);
      if (value) {
        setCredit('');
      }
    };
  
    const handleCreditChange = (e) => {
      const value = e.target.value;
      setCredit(value);
      if (value) {
        setDebit('');
      }
    };

    const HandleSubmitCheckStatus= () => {
      if(!voucherStatus || voucherStatus === 'SUBMITTED') return toast.info('Noting to submit')
      if(voucherStatus === 'CANCELLED') return toast.error('Cannot re-submit a cancelled checked')
      if(voucherStatus === 'CLOSED') return toast.error('Closed Transaction. Cannot Re-close.')
      confirmChange();
    }

    const HandleCancelCheckStatus= () => {
      if(!voucherStatus || voucherStatus === 'CANCELLED') return toast.info('Noting to submit')
      if(voucherStatus === 'CANCELLED') return toast.error('Cannot re-submit a cancelled checked')
      if(voucherStatus === 'CLOSED') return toast.error('Closed Transaction. Cannot Re-close.')
      confirmCancelChange();
    }

    const IssuranceDataRefresh = () => {
      getIssuanceData(VoucherNumber);
      voucherDetailsMain(idLink);
      getCheckVoucherDetails(VoucherNumber);
      getVariance(VoucherNumber);
    }



    return (
      
      <Fragment>
        <NewCheckVoucher open={openNewVoucher} onClose={closeNewVoucherModal} onSaveData={getNewVoucherData} />
        <UpdateVoucher open={openUpdateVoucher} onClose={closeUpdateVoucherModal} onUpdateData={getUpdatedVoucherData} editVoucherData={editVoucherData} />
        <VoucherSelection open={openSelectVoucher} onClose={closeSelectVoucherModal} selectionVoucher={getSelectedVoucherData} />
        <AddSubCode open={openAddSubCodes} onClose={closeSubCodeModal} Data={getSubCodesData} />
        <AddCompanyBranch open={openAddCompanyBranch} onClose={closeAddCompanyBranchModal} Data={getCompanyBranchData} />
        <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={cancelDeletion} YesOnClick={DeleteData} NoOnClick={cancelDeletion} />
        <SearchCheckVoucher open={openSearchVoucher} onClose={closeSearchVoucherModal} selectedData={getSearchCheckVoucher} />
        <IssueCheck open={openCheckIssuance} onClose={closeCheckIssuanceModal} SeriesNo={VoucherNumber} refreshDataMain={IssuranceDataRefresh}/>
        <VerifyPeriodStatus maxWidth="xs" open={openConfirmSwal} onClose={cancelChange} YesOnClick={SubmitCheckIssuance} NoOnClick={cancelChange} statusTitle="SUBMIT" />
        <VerifyPeriodStatus maxWidth="xs" open={openCancelConfirmSwal} onClose={CloseCancelChange} YesOnClick={CancelCheckIssuance} NoOnClick={CloseCancelChange} statusTitle="CANCEL" />
        <ViewLogs open={openViewLogs} onClose={closeViewLogsModal} idLink={VoucherNumber} />
      <Paper>
          <Stack sx={{
              display: 'flex',
              flexDirection: {xs: 'column', md: 'row'},
              alignItems: {xs: '', md: 'center'},
              padding:1,
              gap: {xs: 1}
          }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection:{ sx:'column', md: 'row' }, gap: 1, alignItems:'center' }}>
                <Button variant="contained" size="large" onClick={() => editVoucher(Data)} >Edit Check Voucher Entry</Button>
                <Button variant="contained" size="large" color="info" onClick={openViewLogsModal}>AUDIT LOGS</Button>
                {voucherStatus === '' ? '' : 
                <Chip label={voucherStatus} 
                color={
                  voucherStatus === 'ACTIVE' ? 'info' : 
                  voucherStatus === 'SUBMITTED' ? 'primary' :
                  voucherStatus === 'CANCELLED' ? 'error' :
                  'warning'
                }
                size="large" 
                />
                }
            </Box>
            <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: {xs:'column', md: 'row'}, gap:1}}>
                <TextField value={Variance} disabled onChange={(e) => {setVariance(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '},  }} variant="standard" label="VARIANCE" size="small" placeholder="0.00" InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
                }} />
                <TextField value={DebitAmount} onChange={(e) => {setDebitAmount(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '},  }} disabled variant="standard" label="DEBIT AMOUNT" size="small" placeholder="0.00" InputProps={{
                startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
              }} />
                <TextField value={CreditAmount} onChange={(e) => {setCreditAmount(e.target.value)}} sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: 'lightgreen' }, bgcolor:'black', '& .MuiInputLabel-root': { color: 'white '}, }} disabled variant="standard" label="CREDIT AMOUNT" placeholder="0.00" size="small" InputProps={{
                startAdornment: <InputAdornment position="start"><Typography sx={{color:'white',ml:1}}>₱</Typography></InputAdornment>,
              }} />
            </Box>
          </Stack>
          <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
              <Grid container spacing={1}>
                  <Grid item xs={12} md={4}>
                  <FormControl variant="filled" fullWidth>
                      <InputLabel>Voucher Number</InputLabel>
                      <FilledInput size="small"
                        disabled
                        value={VoucherNumber}
                        onChange={(e) => {setVouherNumber(e.target.value)}}
                        endAdornment={
                          <InputAdornment position="end">
                              <Button size="small" variant="contained" onClick={openSelectVoucherModal} ><SearchIcon /></Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                      <TextField value={VoucherDate} onChange={(newValue) => setVoucherDate(newValue)}  disabled variant="filled" size="small" label="Voucher Date" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl variant="filled" fullWidth>
                      <InputLabel>APV Number</InputLabel>
                      <FilledInput disabled size="small"
                        endAdornment={
                          <InputAdornment position="end">
                              <Button size="small" variant="contained"><SearchIcon /></Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={VoucherPayee} onChange={(e) => {setVoucherPayee(e.target.value)}} disabled variant="filled" size="small" label="Payee" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={8  }>
                    <TextField value={VoucherExplanation} onChange={(e) => {setVoucherExplanation(e.target.value)}} disabled variant="filled" size="small" label="Explanation" fullWidth />
                  </Grid>
              </Grid>
          </Box>
          <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
          <CustomTable maxHeight={200}>
          <TableHeader size="small">
              <CustomHeaderCell>Particulars</CustomHeaderCell>
              <CustomHeaderCell>DEBIT</CustomHeaderCell>
              <CustomHeaderCell>CREDIT</CustomHeaderCell>
              <CustomHeaderCell>Company/Branch</CustomHeaderCell>
              <CustomHeaderCell>Charge To</CustomHeaderCell>
              <CustomHeaderCell>Remarks</CustomHeaderCell>
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
        const filteredData = Array.isArray(voucherDetails) ? voucherDetails : [];
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
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.Company}</s> : `${variable.Company} / ${variable.Branch}`}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.ChargeTo}</s> : variable.ChargeTo}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell padding={1}>
                      {variable.CheckStatus === 'CANCELLED CHECK' ? <s style={{color:'red'}}>{variable.CVRemarks}</s> : variable.CVRemarks}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell textAlign="right" width="10%" padding={0}>
                      {
                        variable.Status === 'NEW ISSUED' ? 
                        ''
                        :
                        variable.Status === 'CLOSED' 
                        ? ''
                        :
                        <>
                        <IconButton sx={{mr:1}} size="small" color="primary" onClick={() => editData(variable)}><EditIcon fontSize="inherit" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(variable)} ><DeleteIcon fontSize="inherit" /></IconButton>
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
          </Box>
          <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
              <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
                    
                      <Autocomplete
                        freeSolo
                        options={uniqueSubCodes}
                        loading={isLoading}
                        noOptionsText={isLoading ? "Loading..." : "No data found"}
                        value={subCodes}
                        onChange={handleAutocompleteChange}
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
                                      <Button size="small" variant="contained" onClick={openSubCodeModal} sx={{ mb: 2.5 }}>
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
                      <TextField value={Description} onChange={(e) => {setDescription(e.target.value)}} variant="filled" size="small" label="Description" fullWidth disabled />
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
                    <Grid item xs={12} md={3}>
                    <TextField value={Branches} onChange={(e) => {setBranch(e.target.value)}} variant="filled" size="small" label="Branch" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                    <TextField value={Debit} onChange={handleDebitChange}  fullWidth variant="filled" label="DEBIT" size="small" placeholder="0.00" InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }} disabled={Credit !== ''}/>
                    </Grid>
                    <Grid item xs={12} md={2}>
                    <TextField value={Credit} onChange={handleCreditChange} fullWidth variant="filled" label="CREDIT" size="small" placeholder="0.00" InputProps={{
                      startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                    }} disabled={Debit !== ''} />
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                      <TextField value={Remarks} onChange={(e) => {setRemarks(e.target.value)}} size="small" variant="filled" label="Remarks" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} xl={2.5} sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: '', md: 'center'}, alignItems: {xs: '', md: 'center'}, gap: 1}}>     
                      {isEditMode ? <Button variant="contained" onClick={UpdateVoucherDetails}>Update</Button> : <Button variant="contained" onClick={newVoucherDetails}>Submit</Button>}
                      {/* <Button variant="contained" color="warning" onClick={openCheckIssuanceModal}>Issue Check</Button> */}
                      <CustomLoadingButton
                        btnClick={ChangeStatusToIssue}
                        isDisabled={loadingIssueBtn}
                        btnVariant="contained"
                        label={loadingIssueBtn ? <>Loading <Box sx={{ml:1}}><XSDotFlash /></Box></> : 'Issue Check'}
                        type="submit"
                        btnSize="medium"
                        color="warning"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<CreateNewFolderIcon/>} fullWidth variant="contained" color="info" onClick={openNewVoucherModal}>NEW CHECK VOUCHER ISSUANCE</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<SearchIcon />} fullWidth variant="contained" color="warning" onClick={openSearchVoucherModal}>SEARCH TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<InsertDriveFileIcon/>} fullWidth variant="contained" color="secondary" onClick={NewEntry}>NEW TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2.5}>
                      <Button startIcon={<FormatClearIcon />} fullWidth variant="contained" color="error" onClick={clearData}>CLEAR ENTRY</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={2}>
                      <Button startIcon={<DeleteForeverIcon />} color="error" fullWidth variant="contained" onClick={HandleCancelCheckStatus}>CANCEL CV TRANSACTION</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={3}>
                      <Button startIcon={<BackupIcon />} fullWidth variant="contained" onClick={HandleSubmitCheckStatus}>SUBMIT CHECK VOUCHER ISSUANCE</Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={3}>
                      <CustomLoadingButton
                        btnClick={PrintInitalCV}
                        isDisabled={loadingInitial}
                        btnVariant="contained"
                        label={loadingInitial ? <>Generating Print Preview <Box sx={{ml:1}}><XSDotFlash /></Box></> : 'PREVIEW INITIAL CV'}
                        type="submit"
                        btnSize="medium"
                        color="info"
                        fullWidth={true}
                        startIcon={<PrintIcon />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={3}>
                      <CustomLoadingButton
                        btnClick={PrintCheckVoucher}
                        isDisabled={loadingBtnTwo}
                        btnVariant="contained"
                        label={loadingBtnTwo ? <>Printing Check Voucher <Box sx={{ml:1}}><XSDotFlash /></Box></> : 'PRINT CV'}
                        type="submit"
                        btnSize="medium"
                        color="info"
                        fullWidth={true}
                        startIcon={<PrintIcon />}
                      />
                    </Grid>
              </Grid>
          </Box>
          <Box sx={{paddingLeft: 1, paddingRight: 1, paddingBottom: 1}}>
          <CustomTable maxHeight={200}>     
          <TableHeader size={'small'} >
              <CustomHeaderCell>Bank</CustomHeaderCell>
              <CustomHeaderCell>Issued By</CustomHeaderCell>
              <CustomHeaderCell>Check Date</CustomHeaderCell>
              <CustomHeaderCell>Check No.</CustomHeaderCell>
              <CustomHeaderCell>Amount</CustomHeaderCell>
              <CustomHeaderCell textAlign="right">Clearing Status</CustomHeaderCell>
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
                  <CustomTableBodyCell padding={1} textAlign="right">
                      {variable.CheckStatus === 'CANCELLED' ? <Chip label={variable.CheckStatus} color="error" size="small" /> : <Chip label={variable.CheckStatus} color="info" size="small" />}
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
          </Box>
          <Box sx={{ padding:1,display: 'flex', flexDirection: 'row', gap:1}}>
              <TextField disabled value={TotalCheckAmount} onChange={(e) => {setTotalCheckAmount(e.target.value)}} variant="standard" label="TOTAL CHECK AMOUNT ISSUED" size="small" placeholder="0.00" InputProps={{
              startAdornment: <InputAdornment position="start">₱</InputAdornment>,
            }} />
              <TextField variant="standard" label="TOTAL BALANCE AMOUNT" placeholder="0.00" size="small" disabled InputProps={{
              startAdornment: <InputAdornment position="start">₱</InputAdornment>,
            }} />
          </Box>
      </Paper>
      </Fragment>
     
    )
  }

  export default CheckVoucherData