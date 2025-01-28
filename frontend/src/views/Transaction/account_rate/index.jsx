import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import AccountRateData from "./AccountRateData"


const AccountRate = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Account Rate List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Account Rate List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <AccountRateData />
    </Fragment>
  )
}

export default AccountRate