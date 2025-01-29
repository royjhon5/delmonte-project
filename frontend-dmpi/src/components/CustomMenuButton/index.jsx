import { MenuItem, useTheme } from "@mui/material"
import PropTypes from 'prop-types'
import { useLocation } from "react-router-dom";

const CustomMenuButton = ({activePath, onClick, label}) => {
  const theme = useTheme(); 
  const location = useLocation();
  const isActive = location.pathname === activePath;
  return (
    <MenuItem
        sx={{ 
            fontSize: '16px', 
            padding: '6px 8px', 
            borderRadius: '8px',
            background: isActive ? theme.palette.appSettings.paletteMode === 'dark' ? '#323C46' : '#F5F5F5' : 'none'
        }}
        onClick={onClick}
    >
            {label}
    </MenuItem>
  )
}

CustomMenuButton.propTypes = {
    activePath: PropTypes.string,
    onClick: PropTypes.any,
    onMouseEnter: PropTypes.func,
    label: PropTypes.string
}

export default CustomMenuButton