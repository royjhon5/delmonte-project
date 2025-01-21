import { useTheme } from "@mui/material"
import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton";
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import { useRef, useState } from "react";
import Collapsebtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/Collapsebtn";
import ListBtn from "../../../../../components/StyledListItemButton/CustomCollapseListButton/ListBtn";
import StyledPopover from "../../../../../components/StyledPopover";

const InventoryList = () => {
  const theme = useTheme();  
  const [open, setOpen] = useState(false);
  const [anchorHere, setAnchorHere] = useState(null)
  const popoverRef = useRef(null)
  const openBool = Boolean(anchorHere);
  const id = 'mouse-over-popover'
  
  const openCollapseBtn = () => {
    setOpen(!open)
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
    <StyledCollapsedButton 
    id={id} 
    onClick={openCollapseBtn} 
    IconChildren={<InventoryIcon fontSize="small" />} 
    CollpaseBtnLabels="Inventory" 
    handlePopoverOpen={theme.palette.appSettings.layout === 'vertical' ? blackFunc : handleOpenCollapse} 
    handlePopoverClose={HandlecloseCollapse}  
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
    />
    <Collapsebtn stateOpen={open}>
        <ListBtn
          label="Product"
        />
        <ListBtn
          label="Brand"
        />
        <ListBtn
          label="Category"
        />
        <ListBtn
          label="Volume"
        />
    </Collapsebtn>
    </>
  )
}

export default InventoryList