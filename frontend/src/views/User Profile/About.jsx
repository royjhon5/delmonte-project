import { Box, CardContent, Paper, Stack, Typography } from "@mui/material"

const About = () => {
  return (
    <Paper>
        <Box sx={{
            padding: '14px 14px 0px'
        }}>
            <CardContent>
                <Typography variant="h6">About</Typography>
            </CardContent>
        </Box>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px'
        }}>
            <Box>
                fetch data box 
            </Box>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px'
            }}>
                Address
            </Stack>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px'
            }}>
                Work
            </Stack>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px'
            }}>
                Status
            </Stack>
        </Stack>
    </Paper>
  )
}

export default About