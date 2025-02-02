import ListSubHeaderStyle from "../../../../../components/StyledListItemButton/ListSubHeader";
import ListItemButtonStyle from "../../../../../components/StyledListItemButton/ListItemButton";
import { useNavigate } from "react-router-dom";
import CustomList from "../../../../../components/StyledListItemButton/CustomeList";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDispatch } from "react-redux";
import { COLOR_ACCOUNTING, COLOR_ADMINISTRATIVE, COLOR_CASHIERPORTAL, COLOR_FINANCIALREPORT, COLOR_MASTERFILE, OPEN_ACCOUNTING, OPEN_ADMINISTRATIVE, OPEN_CASHIERPORTAL, OPEN_FINANCIALREPORT, OPEN_MASTERFILE } from "../../../../../store/actions";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SearchIcon from '@mui/icons-material/Search';
import { Badge } from "@mui/material";

const OverView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateDashboard = () => { navigate('/dashboard'), dispatchFalse() }

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
      <Badge badgeContent={4} color="primary" size="small">
        <ListItemButtonStyle ListbtnLabel="For Confirmation" MenuClick={navigateDashboard} IconChildrens={<CheckCircleIcon fontSize="small" />} />
      </Badge>
      <ListItemButtonStyle ListbtnLabel="For Approval" MenuClick={navigateDashboard} IconChildrens={<ThumbUpIcon fontSize="small" />} />
      <ListItemButtonStyle ListbtnLabel="Search Previous Transaction" MenuClick={navigateDashboard} IconChildrens={<SearchIcon fontSize="small" />} />
      {/* <MasterFile />
      <Transactions />
      <Administrative /> 
      <ListSubHeaderStyle ListLabel="DATA UPLOAD" />
      <OfflineMode />
      <FieldDeviceProcess />
      <PH_NF_JP_DeviceProcess /> */}
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