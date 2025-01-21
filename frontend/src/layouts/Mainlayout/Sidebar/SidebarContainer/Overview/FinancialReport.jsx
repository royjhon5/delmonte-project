import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useRef, useState } from "react";
import Collapsebtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import ListBtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import StyledPopover from "../../../../../components/StyledPopover";
import CustomMenuButton from "../../../../../components/CustomMenuButton";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_ACCOUNTING, OPEN_ADMINISTRATIVE, OPEN_ARCHIVEBYCAT, OPEN_ARCHIVEBYDEPT, OPEN_COATRANSMITTALREPORT, OPEN_CASHIERPORTAL, OPEN_FINANCIALREPORT, OPEN_MASTERFILE, OPEN_SUMMARYDOCTYPE } from "../../../../../store/actions";
import { SvgIconColors } from "../../../../../themes/palette";
import SummaryByCategoryPeriodDate from "../../../../../views/_reports/_SummaryByCategoryPeriodDate";
import SummaryByDeptartmentAndDate from "../../../../../views/_reports/_SummaryByDeptartmentAndDate";
import SummaryByMasterlist from "../../../../../views/_reports/_SummaryOfMasterList";
import SummaryByCOATransmittal from "../../../../../views/_reports/_SummaryCOATransmittal";


const FinancialReport = () => {
  const theme = useTheme();  
  const sideActiveColor = SvgIconColors(theme.palette.appSettings)
  const open = useSelector((state) => state.customization.openFinancialReport);
  const activateColor = useSelector((state) => state.customization.colorFinancialReport)
  const dispatch = useDispatch();
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover';

  const openCollapseBtn = () => {
    dispatch({ type: OPEN_MASTERFILE, openMasterFile: false });
    dispatch({ type: OPEN_ACCOUNTING, openAccounting: false });
    dispatch({ type: OPEN_CASHIERPORTAL, openCashierPortal: false });
    dispatch({ type: OPEN_FINANCIALREPORT, openFinancialReport: !open });
    dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false });
  }

  const openSummaryByCategory = () => {
    dispatch({ type: OPEN_ARCHIVEBYCAT, openArchiveByCat: true })
  }

  const openSummaryByDept = () => {
    dispatch({ type: OPEN_ARCHIVEBYDEPT, openArchiveByDept: true })
  }

  const openSummaryByMasterlist = () => {
    dispatch({ type: OPEN_SUMMARYDOCTYPE, openSummaryDocType: true })
  }

  const openCOATransmittalReportModal = () => {
    dispatch({ type: OPEN_COATRANSMITTALREPORT, openCOATransmittalReport: true })
  }

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
    <SummaryByCategoryPeriodDate maxWidth={"xs"} />
    <SummaryByDeptartmentAndDate maxWidth={"xs"} />
    <SummaryByMasterlist maxWidth={"xs"}/>
    <SummaryByCOATransmittal maxWidth={"xs"}/>
    <StyledCollapsedButton 
    id={id} 
    onClick={openCollapseBtn} 
    IconChildren={<StickyNote2Icon fontSize="small" />} 
    CollpaseBtnLabels="Reports" 
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
          label="Summary of Archived By Category and Period Date"
          onClick={openSummaryByCategory}
        />
        <CustomMenuButton 
          label="Summary of Archived By Dept. and Period Date"
          onClick={openSummaryByDept}
        />
        <CustomMenuButton 
          label="Masterlist Summary of Archived By Document Type"
          onClick={openSummaryByMasterlist}
        />
        <CustomMenuButton 
          label="COA Transmittal Report"
          onClick={openCOATransmittalReportModal}
        />
        </>
      }
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          label="Summary of Archived By Category and Period Date"
          onClick={openSummaryByCategory}
        />
        <ListBtn
          label="Summary of Archived By Dept. and Period Date"
          onClick={openSummaryByDept}
        />
        <ListBtn
          label="Masterlist Summary of Archived By Document Type"
          onClick={openSummaryByMasterlist}
        />
        <ListBtn
          label="COA Transmittal Report"
          onClick={openCOATransmittalReportModal}
        />
    </Collapsebtn>
    </>
  )
}

export default FinancialReport