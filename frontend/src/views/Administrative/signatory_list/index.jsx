import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import SignatoryData from "./SignatoryData"
import { Helmet } from "react-helmet-async"



const SignatoryList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Dashboard: Signatory List</title>
        </Helmet>
        <Box sx={{ mb: '40px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4">Signatory List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <SignatoryData />
    </Fragment>
  )
}

export default SignatoryList