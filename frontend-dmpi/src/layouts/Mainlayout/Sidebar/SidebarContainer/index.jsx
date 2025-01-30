import { Stack, useTheme } from "@mui/material"
import OverView from "./Overview"

const SidebarContainer = () => {
  const theme = useTheme();
  return (
    <Stack sx={{ 
        display: 'flex',
        flexDirection: 'column'
    }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: theme.palette.appSettings.layout === 'collapsed' ? '3px' : '16px',
            paddingRight: theme.palette.appSettings.layout === 'collapsed' ? '3px' : '16px'
        }}>
            <OverView />
        </Stack>
    </Stack>
  )
}

export default SidebarContainer