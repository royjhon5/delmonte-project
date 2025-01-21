import { Box, Grid, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../components/BreadCrumbs"
import ProfileHeader from "./ProfileHeader"
import About from "./About"
import ActivityLogs from "./ActivityLogs"

const UserProfile = () => {

  return (
    <Fragment>
        <Box sx={{ mb: '40px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4">User Profile</Typography>
            <BreadCrumbs />
        </Box>
        <ProfileHeader />
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <About />
            </Grid>
            <Grid item xs={12} md={8}>
                <ActivityLogs />
            </Grid>
        </Grid>
    </Fragment>
  )
}

export default UserProfile