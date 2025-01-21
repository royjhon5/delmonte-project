import PropTypes from 'prop-types'
import { Box } from "@mui/material"

const BoxBadge = ({children,color, bgcolor}) => {
  return (
    <Box sx={{
        height: '24px',
        minWidth: '24px',
        lineHeight: 0,
        borderRadius: '6px',
        cursor: 'default',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        justifyContent: 'center',
        textTransform: 'capitalize',
        padding: '0px 6px',
        fontSize: '0.75rem',
        fontWeight: '700',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        color: color,
        backgroundColor: bgcolor,
        marginLeft: '8px'
    }}>
        {children}
    </Box>
  )
}

BoxBadge.propTypes = {
    children: PropTypes.node,
    color: PropTypes.any,
    bgcolor: PropTypes.any,
}

export default BoxBadge