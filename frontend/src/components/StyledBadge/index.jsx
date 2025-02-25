import PropTypes from 'prop-types';
import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: 'red',
      color: 'red',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}));


const StyledBadges = ({children, badgeContent}) => {
  return (
    <StyledBadge
        overlap="circular"
        variant="dot"
        badgeContent={badgeContent}
      >
        {children}
    </StyledBadge>
  )
}

StyledBadges.propTypes = {
    children: PropTypes.any,
}

export default StyledBadges