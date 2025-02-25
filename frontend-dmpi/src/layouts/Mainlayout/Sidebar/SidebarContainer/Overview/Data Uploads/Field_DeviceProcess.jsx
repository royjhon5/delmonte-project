import { useTheme } from "@mui/material"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconColors } from "../../../../../../themes/palette";
import StyledCollapsedButton from "../../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import Collapsebtn from "../../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import StyledPopover from "../../../../../../components/StyledPopover";
import ListBtn from "../../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import CustomMenuButton from "../../../../../../components/CustomMenuButton";
import { OPEN_ADMINISTRATIVE, OPEN_FIELD_DEVICE, OPEN_MASTERFILE, OPEN_OFFLINEMODE, OPEN_PH_NF_JP_DEVICE, OPEN_TRANSACTION } from "../../../../../../store/actions";
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';

const FieldDeviceProcess = () => {
  const theme = useTheme();  
  const sideActiveColor = SvgIconColors(theme.palette.appSettings)
  const open = useSelector((state) => state.customization.openFieldDevice);
  const activateColor = useSelector((state) => state.customization.colorCashierPortal)
  const dispatch = useDispatch();
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover'

  const openCollapseBtn = () => {
    dispatch({ type: OPEN_MASTERFILE, openMasterFile: false });
    dispatch({ type: OPEN_TRANSACTION, openTransaction: false });
    dispatch({ type: OPEN_ADMINISTRATIVE, openAdministrative: false  });
    dispatch({ type: OPEN_OFFLINEMODE, openOfflineMode: false });
    dispatch({ type: OPEN_FIELD_DEVICE, openFieldDevice: !open });
    dispatch({ type: OPEN_PH_NF_JP_DEVICE, openPHNFJPDevice: false });
  }

  // const colorCollapseBtn = () => {
  //   dispatch({ type: COLOR_MASTERFILE, colorMasterFile: false });
  //   dispatch({ type: COLOR_ACCOUNTING, colorAccounting: false });
  //   dispatch({ type: COLOR_CASHIERPORTAL, colorCashierPortal: false });
  //   dispatch({ type: COLOR_FINANCIALREPORT, colorFinancialReport: false });
  //   dispatch({ type: COLOR_ADMINISTRATIVE, colorAdministrative: true });
  // }

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
    IconChildren={<MobileScreenShareIcon fontSize="small" />} 
    CollpaseBtnLabels="Field Device Process" 
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
          label="Daily Cash Position Report"
        />
        </>
      }
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          label="Daily Cash Position Report"
        />
    </Collapsebtn>
    </>
  )
}

export default FieldDeviceProcess