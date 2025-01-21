import { Box, ListItemButton, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom';
import { SvgIconColors } from '../../../themes/palette';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ListBtn = ({ activePath, onClick, onMouseEnter, label }) => {
  const theme = useTheme(); 
  const location = useLocation();
  const isActive = location.pathname === activePath;
  const hoverColor = SvgIconColors(theme.palette.appSettings)

  return (
    <ListItemButton sx={{
        margin: '0px 0px 4px',
        padding: '4px 8px 4px 12px',
        minHeight: '36px',
        display: 'flex',
        fontSize: '0.875rem',
        borderRadius: '6px',
        color: isActive ? theme.palette.appSettings.paletteMode === 'dark' ? 'white' : 'black' : '#637381',
    }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    >   
      <Box sx={{
        display: 'flex', 
        justifyContent:'center', 
        alignItems: 'center', 
        width: '24px', 
        height: '24px', 
        flexShrink: 0, 
        marginRight: '16px',
      }}>
        <FiberManualRecordIcon sx={{ fontSize: '5px',
             transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', 
             transform: isActive ? 'scale(2.5)' : 'scale(1)',
             color: isActive ? `${hoverColor.svgcolor[100]}` : '#637381'
             }} />
      </Box>
        {label}
    </ListItemButton>
  )
}

ListBtn.propTypes = {
    activePath: PropTypes.string,
    onClick: PropTypes.any,
    onMouseEnter: PropTypes.func,
    label: PropTypes.string
}

export default ListBtn