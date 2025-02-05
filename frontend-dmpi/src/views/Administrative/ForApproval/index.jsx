import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import ConfirmationData from "./ApprovalData"


const ApprovalModule = () => {
  return (
    <Fragment>
        <Helmet>
            <title>For Approval</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">For Approval</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ConfirmationData />
    </Fragment>
  )
}

export default ApprovalModule