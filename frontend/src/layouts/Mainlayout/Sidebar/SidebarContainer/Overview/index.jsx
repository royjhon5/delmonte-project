import ListSubHeaderStyle from "../../../../../components/StyledListItemButton/ListSubHeader";
import ListItemButtonStyle from "../../../../../components/StyledListItemButton/ListItemButton";
import { useNavigate } from "react-router-dom";
import CustomList from "../../../../../components/StyledListItemButton/CustomeList";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDispatch } from "react-redux";
import { COLOR_ACCOUNTING, COLOR_ADMINISTRATIVE, COLOR_CASHIERPORTAL, COLOR_FINANCIALREPORT, COLOR_MASTERFILE, OPEN_ACCOUNTING, OPEN_ADMINISTRATIVE, OPEN_CASHIERPORTAL, OPEN_FINANCIALREPORT, OPEN_MASTERFILE } from "../../../../../store/actions";
import MasterFile from "./Masterfile";
import Transactions from "./Transactions";
import OfflineMode from "./Data Uploads/OfflineMode";
import FieldDeviceProcess from "./Data Uploads/Field_DeviceProcess";
import PH_NF_JP_DeviceProcess from "./Data Uploads/PH_NF_JP_DeviceProcess";
import Administrative from "./Administrative";
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import PrintIcon from '@mui/icons-material/Print';

const OverView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateDashboard = () => { navigate('/dashboard'), dispatchFalse() }
  const navigateBatchingDAr = () => { navigate('/dashboard/batching-dar') }

  const dispatchFalse = () => {
    dispatch({ type: OPEN_MASTERFILE, openMasterFile: false });
    dispatch({ type: OPEN_ACCOUNTING, openAccounting: false });
    dispatch({ type: OPEN_CASHIERPORTAL, openCashierPortal: false });
    dispatch({ type: OPEN_FINANCIALREPORT, openFinancialReport: false });
    dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false });
    dispatch({ type: COLOR_MASTERFILE, colorMasterFile: false });
    dispatch({ type: COLOR_ACCOUNTING, colorAccounting: false });
    dispatch({ type: COLOR_CASHIERPORTAL, colorCashierPortal: false });
    dispatch({ type: COLOR_FINANCIALREPORT, colorFinancialReport: false });
    dispatch({ type: COLOR_ADMINISTRATIVE, colorAdministrative: false });
  }
  return (
    <CustomList >
      <ListSubHeaderStyle ListLabel="OVERVIEW" />
      <ListItemButtonStyle ListbtnLabel="Dashboard" activePath="/dashboard" MenuClick={navigateDashboard} IconChildrens={<DashboardIcon fontSize="small" />} />
      <MasterFile />
      <Transactions />
      <Administrative /> 
      <ListSubHeaderStyle ListLabel="DATA UPLOAD" />
      <OfflineMode />
      <FieldDeviceProcess />
      <PH_NF_JP_DeviceProcess />
      <ListSubHeaderStyle ListLabel="BATCHING MODULE" />
      <ListItemButtonStyle ListbtnLabel="Batching DAR" activePath="/dashboard/batching-dar" MenuClick={navigateBatchingDAr} IconChildrens={<BatchPredictionIcon fontSize="small" />} />
      <ListItemButtonStyle ListbtnLabel="Batched DAR Report" activePath="/dashboard" MenuClick={navigateDashboard} IconChildrens={<PrintIcon fontSize="small" />} />
      {/* {(accessToken.UserLevel == 'Schema Admin' || accessToken.UserLevel == 'Admin') && accessToken.UserLevel != 'COA User' ? <ListItemButtonStyle ListbtnLabel="My Portal" activePath="/dashboard/my-portal" MenuClick={navigateMyProtal} IconChildrens={<WebIcon fontSize="small" />} /> : ""} */}
      {/* <ListItemButtonStyle ListbtnLabel="Upload Documents" MenuClick={navigateDashboard} IconChildrens={<CloudUploadIcon fontSize="small" />} /> */}
      {/* {accessToken.UserLevel != 'COA User' ? <UploadDocuments /> : ""} */}
      {/* <ListItemButtonStyle ListbtnLabel="Inquiry" activePath="/dashboard/inquiry" MenuClick={navigateInquiry} IconChildrens={<QuizIcon fontSize="small" />} /> */}
      {/* {accessToken.UserLevel != 'COA User' ? <FinancialReport /> : ""} */}
      
      {/* {accessToken.UserLevel != 'COA User' ? <ListItemButtonStyle ListbtnLabel="User Manual" MenuClick={navigateDashboard} IconChildrens={<LibraryBooksIcon fontSize="small" />} /> : ""} */}
    </CustomList>
  )
}

export default OverView