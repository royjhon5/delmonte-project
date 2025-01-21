import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../components/BreadCrumbs"
import { Helmet } from "react-helmet-async"
import MyPortalData from "./MyPortalData"


const MyPortal = () => {
  return (
    <Fragment>
        <Helmet>
            <title>My Portal</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">My Portal</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <MyPortalData />
    </Fragment>
  )
}

export default MyPortal