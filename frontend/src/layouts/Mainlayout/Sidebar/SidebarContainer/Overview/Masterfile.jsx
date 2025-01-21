import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useEffect, useRef, useState } from "react";
import Collapsebtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import ListBtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import StyledPopover from "../../../../../components/StyledPopover";
import CustomMenuButton from "../../../../../components/CustomMenuButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { COLOR_ACCOUNTING, COLOR_ADMINISTRATIVE, COLOR_CASHIERPORTAL, COLOR_FINANCIALREPORT, COLOR_MASTERFILE, OPEN_ACCOUNTING, OPEN_ADMINISTRATIVE, OPEN_CASHIERPORTAL, OPEN_FINANCIALREPORT, OPEN_MASTERFILE } from "../../../../../store/actions";
import { SvgIconColors } from "../../../../../themes/palette";

const MasterFile = () => {
  const theme = useTheme();  
  const sideActiveColor = SvgIconColors(theme.palette.appSettings)
  const open= useSelector((state) => state.customization.openMasterFile);
  const activateColor = useSelector((state) => state.customization.colorMasterFile)
  const dispatch = useDispatch();
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover'

  const navigate = useNavigate()
  const navigateGroupLine = () => {navigate('/dashboard/group-line'), colorCollapseBtn()}
  const navigateEmployeeList = () => {navigate('/dashboard/employee-list'), colorCollapseBtn()}
  const navigateDayType = () => {navigate('/dashboard/day-type'), colorCollapseBtn()}

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
    if (location.pathname === '/dashboard/group-line' 
    ||  location.pathname === '/dashboard/employee-list'
    ||  location.pathname === '/dashboard/day-type'
    ) {
      dispatch({ type: COLOR_ADMINISTRATIVE, colorMasterFile: true });
    } else {
      dispatch({ type: COLOR_ADMINISTRATIVE, colorMasterFile: false });
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
    IconChildren={<AdminPanelSettingsIcon fontSize="small" />} 
    CollpaseBtnLabels="Masterfile" 
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
          label="Employee List"
          activePath="/dashboard/employee-list"
          onClick={navigateEmployeeList}
        />
        <CustomMenuButton 
          label="Account To Charge"
          activePath="/dashboard/scanner-list"
          onClick={navigateGroupLine}
        />
         <CustomMenuButton 
          label="Group Line List"
          activePath="/dashboard/group-line"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton 
          label="Day Type List"
          activePath="/dashboard/day-type"
          onClick={navigateDayType}
        />
        <CustomMenuButton
          label="Field List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton
          label="Activity List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton
          label="GL Code List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton
          label="Cost Center List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton
          label="Location List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <CustomMenuButton
          label="Department List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        </>
      }
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          label="Employee List"
          activePath="/dashboard/employee-list"
          onClick={navigateEmployeeList}
        />
        <ListBtn
          label="Account To Charge"
          activePath="/dashboard/scanner-list"
          onClick={navigateGroupLine}
        />
        <ListBtn
          label="Group Line List"
          activePath="/dashboard/group-line"
          onClick={navigateGroupLine}
        />
        <ListBtn
          label="Day Type List"
          activePath="/dashboard/day-type"
          onClick={navigateDayType}
        />
        <ListBtn
          label="Field List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
         <ListBtn
          label="Activity List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
         <ListBtn
          label="GL Code List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <ListBtn
          label="Cost Center List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <ListBtn
          label="Location List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
        <ListBtn
          label="Department List"
          activePath="/dashboard/logs"
          onClick={navigateGroupLine}
        />
    </Collapsebtn>
    </>
  )
}

export default MasterFile