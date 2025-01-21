import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material"

const UserInfo = () => {
  return (
    <Paper sx={{
        padding: '24px',
    }}>
        <Box sx={{ width: '100%', mb:2, display: 'flex' ,flexDirection: 'row', justifyContent: 'space-between'}}>
            <Typography>ID NUMBER</Typography>
            <Typography>Role</Typography>
        </Box>
        <Box sx={{ display: 'grid', gap: '24px 16px', 
            gridTemplateColumns: {
                xl: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)', 
                xs: 'repeat(1, 1fr)'
            }  
        }}>
            <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="First name"
            />
            <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="Last name"
            />
             <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="Phone Number"
            />
             <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="Email Address"
            />
            <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="Address (Optional)"
            />
            <TextField 
                variant="outlined"
                fullWidth
                size="medium"
                label="Gender"
            />
        </Box>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'flex-end',
            marginTop: '24px'
        }}>
            <TextField 
                variant="outlined"
                multiline
                fullWidth
                size="medium"
                label="About (Optional)"
                rows={6}
            />
            <Button variant="contained" size="large"> 
                Save Changes
            </Button>
        </Stack>
    </Paper>
  )
}

export default UserInfo