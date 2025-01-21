import { Box, Paper, Typography } from "@mui/material"

const ActivityLogs = () => {
  return (
    <Paper>
        <Box sx={{
            padding: '24px'
        }}> 
            <Typography variant="h6">
                User Activity Logs
            </Typography>
        </Box>
    </Paper>
  )
}

export default ActivityLogs