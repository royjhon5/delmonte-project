import { Box, Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import MiscellaneousData from "./MiscellaneousData"

const MiscellaneousDocuments = () => {
  return (
    <Fragment>
    <Helmet>
        <title>Upload Documents: Miscellaneous</title>
    </Helmet>
    <Box sx={{ mb: '20px' }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                <Typography variant="h4">Upload Miscellaneous & Other Documents</Typography>
                <BreadCrumbs />
            </Box>
        </Stack>
    </Box>
    <MiscellaneousData />
</Fragment>
  )
}

export default MiscellaneousDocuments