import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"

import InquiryData from "./InquiryData"
import BreadCrumbs from "../../components/BreadCrumbs"


const InquiryPreview = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Inquiry</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Inquiry</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <InquiryData />
    </Fragment>
  )
}

export default InquiryPreview