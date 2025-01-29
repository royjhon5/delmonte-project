import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import AccountMasterData from "./AccountMasterData"


const AccountMasterList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Account Master List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Account Master List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <AccountMasterData />
    </Fragment>
  )
}

export default AccountMasterList