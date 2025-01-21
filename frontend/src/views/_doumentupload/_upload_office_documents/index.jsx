import { Box, Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import OfficeDocumentsData from "./OfficeDocumentsData"

const UploadOfficeDocuments = () => {
  return (
    <Fragment>
    <Helmet>
        <title>Upload Documents: Office</title>
    </Helmet>
    <Box sx={{ mb: '20px' }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                <Typography variant="h4">Upload Office Documents</Typography>
                <BreadCrumbs />
            </Box>
        </Stack>
    </Box>
    <OfficeDocumentsData />
</Fragment>
  )
}

export default UploadOfficeDocuments