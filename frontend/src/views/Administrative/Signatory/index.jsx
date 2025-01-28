import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import SignatoryData from "./SignatoryData"


const SignatoryList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Signatories</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Signatories</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <SignatoryData />
    </Fragment>
  )
}

export default SignatoryList