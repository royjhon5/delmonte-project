import { Box, Stack, useTheme } from "@mui/material"
import PGBLogo from '../../../../assets/company-logo/pgbLogo.png'

const TopNavLogo = () => {
  const theme = useTheme();
  return (
    <Stack sx={{ 
        display:
        theme.palette.appSettings.layout === 'vertical' ? 'none'
        :
        theme.palette.appSettings.layout === 'horizontal' ? 'flex' 
        : 
        'none', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        mr: 3
        }}>
            <Box component="div"
                sx={{
                    width: 40,
                    height: 40,
                    display: 'inline-flex',
                }}
            >
                <img src={PGBLogo} />
            </Box>
    </Stack>
  )
}

export default TopNavLogo