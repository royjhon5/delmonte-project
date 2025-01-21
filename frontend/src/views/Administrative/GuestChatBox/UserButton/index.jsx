import { ListItemButton, Avatar, ListItemText, Stack, Typography, Badge, Box } from '@mui/material'
import PropTypes from 'prop-types'
const StyledButtonComponent = ({UserName, chatdesc, timeAgo, onClick, badgeValue}) => {
  return (
    <ListItemButton sx={{
        padding: '12px 20px'
    }}
    onClick={onClick}
    >
    <Badge badgeContent={badgeValue} color="primary">
        <Avatar />
    </Badge>
    <ListItemText sx={{
        flex: '1 1 auto',
        minWidth: '0px',
        margin: '0px 0px 0px 16px'
    }}>
        <Typography sx={{ fontSize: '0.775rem'}}>{UserName}</Typography>
        <Box>{chatdesc}</Box>
    </ListItemText>
    <Stack sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: '16px',
        height: '44px'
    }}>
        <Typography sx={{ fontSize: '11px'}}>{timeAgo}</Typography>
        
    </Stack>
    </ListItemButton>
  )
}

StyledButtonComponent.propTypes = {
    UserName: PropTypes.string,
    chatdesc: PropTypes.object,
    timeAgo: PropTypes.object,
    onClick: PropTypes.func,
    badgeValue: PropTypes.number
}

export default StyledButtonComponent