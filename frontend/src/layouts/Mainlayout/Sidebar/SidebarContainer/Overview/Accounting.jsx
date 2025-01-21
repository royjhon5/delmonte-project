import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import CalculateIcon from '@mui/icons-material/Calculate';
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

const Accounting = () => {
  const theme = useTheme();  
  const sideActiveColor = SvgIconColors(theme.palette.appSettings)
  const open = useSelector((state) => state.customization.openAccounting);
  const activateColor = useSelector((state) => state.customization.colorAccounting)
  const dispatch = useDispatch();
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover'

  const navigate = useNavigate()
  const navigateCheckVoucher = () => {navigate('/accounting/check-voucher'), colorCollapseBtn()}
  const navigateCashVoucher = () => {navigate('/accounting/cash-voucher'), colorCollapseBtn()}
  const navigateJournalVoucher = () => {navigate('/accounting/journal-voucher'), colorCollapseBtn()}

  const openCollapseBtn = () => {
    dispatch({ type: OPEN_MASTERFILE, openMasterFile: false });
    dispatch({ type: OPEN_ACCOUNTING, openAccounting: !open });
    dispatch({ type: OPEN_CASHIERPORTAL, openCashierPortal: false });
    dispatch({ type: OPEN_FINANCIALREPORT, openFinancialReport: false });
    dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false });
  }

  const colorCollapseBtn = () => {
    dispatch({ type: COLOR_MASTERFILE, colorMasterFile: false });
    dispatch({ type: COLOR_ACCOUNTING, colorAccounting: true });
    dispatch({ type: COLOR_CASHIERPORTAL, colorCashierPortal: false });
    dispatch({ type: COLOR_FINANCIALREPORT, colorFinancialReport: false });
    dispatch({ type: COLOR_ADMINISTRATIVE, colorAdministrative: false });
  }

  useEffect(() => {
    if (location.pathname === '/accounting/check-voucher' 
    ||  location.pathname === '/accounting/cash-voucher'
    ||  location.pathname === '/accounting/journal-voucher'
    ) {
      dispatch({ type: COLOR_ACCOUNTING, colorAccounting: true });
    } else {
      dispatch({ type: COLOR_ACCOUNTING, colorAccounting: false });
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
    IconChildren={<CalculateIcon fontSize="small" />} 
    CollpaseBtnLabels="Accounting" 
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
          activePath="/accounting/check-voucher"
          onClick={navigateCheckVoucher}
          label="Check Voucher"
        />
        <CustomMenuButton 
          label="Check Issuance"
        />
        <CustomMenuButton 
          activePath="/accounting/cash-voucher"
          onClick={navigateCashVoucher}
          label="Cash Voucher"
        />
        <CustomMenuButton 
          activePath="/accounting/journal-voucher"
          onClick={navigateJournalVoucher}
          label="Journal Voucher"
        />
        <CustomMenuButton 
          label="Sales Journal Entry Form"
        />
        <CustomMenuButton 
          label="Payee Ledger"
        />
        <CustomMenuButton 
          label="Issued Check Monitoring"
        />
        <CustomMenuButton 
          label="Cancelled Check Reports"
        />
        </>
      }
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          activePath="/accounting/check-voucher"
          onClick={navigateCheckVoucher}
          label="Check Voucher"
        />
        <ListBtn
          label="Check Issuance"
        />
        <ListBtn
          activePath="/accounting/cash-voucher"
          onClick={navigateCashVoucher}
          label="Cash Voucher"
        />
        <ListBtn
          activePath="/accounting/journal-voucher"
          onClick={navigateJournalVoucher}
          label="Journal Voucher"
        />
        <ListBtn
          label="Sales Journal Entry Form"
        />
        <ListBtn
          label="Payee Ledger"
        />
        <ListBtn
          label="Issued Check Monitoring"
        />
        <ListBtn
          label="Cancelled Check Reports"
        />
    </Collapsebtn>
    </>
  )
}

export default Accounting