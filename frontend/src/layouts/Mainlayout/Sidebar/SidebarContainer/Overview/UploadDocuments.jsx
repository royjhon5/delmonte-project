import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useEffect, useRef, useState } from "react";
import Collapsebtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import ListBtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import StyledPopover from "../../../../../components/StyledPopover";
import { useNavigate } from "react-router-dom";
import CustomMenuButton from "../../../../../components/CustomMenuButton";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_MASTERFILE, OPEN_ACCOUNTING, OPEN_CASHIERPORTAL, OPEN_FINANCIALREPORT, OPEN_ADMINISTRATIVE, COLOR_MASTERFILE, COLOR_ACCOUNTING, COLOR_CASHIERPORTAL, COLOR_FINANCIALREPORT, COLOR_ADMINISTRATIVE } from "../../../../../store/actions";
import { SvgIconColors } from "../../../../../themes/palette";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadDocuments = () => {
  const theme = useTheme();  
  const sideActiveColor = SvgIconColors(theme.palette.appSettings)
  const open = useSelector((state) => state.customization.openMasterFile);
  const dispatch = useDispatch();
  const activateColor = useSelector((state) => state.customization.colorMasterFile)
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover'
  const navigate = useNavigate()
  const navigateFinancialDocuments = () => {navigate('/dashboard/upload-financial-documents'),colorCollapseBtn()}
  const navigateOfficeDocuments = () => {navigate('/dashboard/upload-office-documents'),colorCollapseBtn()}
  const navigatePayroll = () => {navigate('/dashboard/upload-payroll-documents'),colorCollapseBtn()}
  const navigateMiscellaneous = () => {navigate('/dashboard/upload-miscellaneous-documents'),colorCollapseBtn()}
  const navigateAOM = () => {navigate('/dashboard/upload-aom-documents'),colorCollapseBtn()}

  const openCollapseBtn = () => {
    dispatch({ type: OPEN_MASTERFILE, openMasterFile: !open });
    dispatch({ type: OPEN_ACCOUNTING, openAccounting: false });
    dispatch({ type: OPEN_CASHIERPORTAL, openCashierPortal: false });
    dispatch({ type: OPEN_FINANCIALREPORT, openFinancialReport: false });
    dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false });
  }

  const colorCollapseBtn = () => {
    dispatch({ type: COLOR_MASTERFILE, colorMasterFile: true });
    dispatch({ type: COLOR_ACCOUNTING, colorAccounting: false });
    dispatch({ type: COLOR_CASHIERPORTAL, colorCashierPortal: false });
    dispatch({ type: COLOR_FINANCIALREPORT, colorFinancialReport: false });
    dispatch({ type: COLOR_ADMINISTRATIVE, colorAdministrative: false });
  }

  useEffect(() => {
    if (location.pathname === '/dashboard/upload-financial-documents' 
    ||  location.pathname === '/dashboard/upload-office-documents'
    ||  location.pathname === '/dashboard/upload-payroll-documents'
    ||  location.pathname === '/dashboard/upload-miscellaneous-documents'
    ||  location.pathname === '/masterfile/chart-of-account'
    ||  location.pathname === '/masterfile/customer-list'
    ) {
      dispatch({ type: COLOR_MASTERFILE, colorMasterFile: true });
    } else {
      dispatch({ type: COLOR_MASTERFILE, colorMasterFile: false });
    }
  }, [dispatch]);

  const handleOpenCollapse = (event) => {
    setAnchorHere(event.currentTarget)
  }

  const HandlecloseCollapse = () => {
    if (popoverRef.current && popoverRef.current.contains(event.relatedTarget)) {
      return;
    }
    setAnchorHere(null)
  }

  const blackFunc = () => {};
  return (
    <>
    <StyledCollapsedButton 
    id={id} 
    onClick={openCollapseBtn} 
    IconChildren={<CloudUploadIcon fontSize="small" />} 
    CollpaseBtnLabels="Upload Documents" 
    handlePopoverOpen={theme.palette.appSettings.layout === 'vertical' ? blackFunc : handleOpenCollapse} 
    handlePopoverClose={HandlecloseCollapse}  
    bgcolor={activateColor ? `${sideActiveColor.svgcolor[600]}` : 'none'}
    iconcolor={activateColor ? `${sideActiveColor.svgcolor[100]}` : '#637381'}
    >
        {open ? 
        <ArrowDropDownTwoToneIcon sx={{ display: theme.palette.appSettings.layout ==='collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'none' : 'flex'}} />:
        <ArrowRightIcon sx={{ display: theme.palette.appSettings.layout ==='collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'none' : 'flex'}} />
        }
        <ArrowDropDownTwoToneIcon sx={{ display: theme.palette.appSettings.layout ==='collapsed' ? 'none' : theme.palette.appSettings.layout === 'horizontal' ? 'flex' : 'none'}} />
    </StyledCollapsedButton>
    <StyledPopover 
      id={id}
      open={openBool}
      anchorEl={anchorHere}
      onMouseLeave={HandlecloseCollapse}
      onMouseEnter={openCollapseBtn}
      popoverRef={popoverRef}
      menuButton={
        <>
        <CustomMenuButton 
          activePath="/dashboard/upload-financial-documents"
          label="Financial Documents"
          onClick={navigateFinancialDocuments}
        />
        <CustomMenuButton 
          activePath="/dashboard/upload-office-documents"
          label="Office Documents"
          onClick={navigateOfficeDocuments}
        />
        <CustomMenuButton 
          activePath="/dashboard/upload-payroll-documents"
          label="Payroll & Payslips"
          onClick={navigatePayroll}
        />
        <CustomMenuButton 
          activePath="/dashboard/upload-miscellaneous-documents"
          label="Miscellaneous/Others"
          onClick={navigateMiscellaneous}
        />
         <CustomMenuButton 
          activePath="/dashboard/upload-aom-documents"
          label="AOM Documents"
          onClick={navigateAOM}
        />
        </>
      }
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          activePath="/dashboard/upload-financial-documents"
          label="Financial Documents"
          onClick={navigateFinancialDocuments}
        />
        <ListBtn
          activePath="/dashboard/upload-office-documents"
          label="Office Documents"
          onClick={navigateOfficeDocuments}
        />
        <ListBtn
         activePath="/dashboard/upload-payroll-documents"
          label="Payroll & Payslips"
          onClick={navigatePayroll}
        />
        <ListBtn
          activePath="/dashboard/upload-miscellaneous-documents"
          label="Miscellaneous/Others"
          onClick={navigateMiscellaneous}
        />
         <ListBtn
          activePath="/dashboard/upload-aom-documents"
          label="AOM Documents"
          onClick={navigateAOM}
        />
    </Collapsebtn>
    </>
  )
}

export default UploadDocuments