import { Stack, Typography } from "@mui/material"
import PropTypes from 'prop-types'
const AuthorBox = ({authorMessage, authorTime, id}) => {
  return (
    <Stack id={id} sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: '40px'
    }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            <Typography sx={{ fontSize: '0.75rem' }}>{authorTime}</Typography>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative'
            }}>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    minWidth: '48px',
                    maxWidth: '320px',
                    borderRadius:'8px',
                    background: 'rgb(200, 250, 214)',
                    color: 'rgb(33, 43, 54)'
                }}>
                {authorMessage}
                </Stack>
            </Stack>
        </Stack>
    </Stack>
  )
}

AuthorBox.propTypes = {
    authorTime: PropTypes.object,
    authorMessage: PropTypes.string,
    id: PropTypes.string,
}

export default AuthorBox