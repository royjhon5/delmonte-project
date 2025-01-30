import { Drawer, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { OPEN_CUSTOM_MODAL } from "../../../../store/actions";
import DataContainer from "./data-container";

const ActionDrawer = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.customization.openCustomModal);
  const CloseDialog = () => {
    dispatch({ type: OPEN_CUSTOM_MODAL, openCustomModal: false });
  }


  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': {...theme.components.MuiDrawer, maxWidth: '420px', backdropFilter: 'blur(20px)', 
      background: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(33, 43, 54, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      } 
    }}
      open={open}
      onClose={CloseDialog}
      BackdropProps={{ invisible: true  }}
      anchor="right"
    >
        <DataContainer />
    </Drawer>
  )
}

export default ActionDrawer