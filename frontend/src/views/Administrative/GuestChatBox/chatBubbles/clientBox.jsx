import { Avatar, Stack, Typography } from "@mui/material"
import PropTypes from 'prop-types'
const ClientBox = ({time, message, id}) => {
  return (
    <Stack id={id} sx={{    
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'unset',
        marginBottom: '40px',
    }}>
        <Avatar sx={{ width: '32px', height: '32px', marginRight: '16px' }} />
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
        }}>
            <Typography sx={{ fontSize: '0.75rem' }}>{time}</Typography>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative'
            }}>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '12px',
                    minWidth: '48px',
                    maxWidth: '320px',
                    backgroundColor: 'rgba(145, 158, 171, 0.12)',
                    fontSize: '0.875rem',
                    borderRadius:'8px',
                }}>
                    {message}
                </Stack>
            </Stack>
        </Stack>
    </Stack>
  )
}
ClientBox.propTypes = {
    time: PropTypes.object,
    message: PropTypes.string,
    id: PropTypes.string
}


export default ClientBox