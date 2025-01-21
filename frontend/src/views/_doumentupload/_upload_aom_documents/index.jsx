import { Box, Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import AOMDocumentsData from "./AOMDocumentsData"

const UploadAOMDocuments = () => {
  return (
    <Fragment>
    <Helmet>
        <title>Upload Documents: AOM</title>
    </Helmet>
    <Box sx={{ mb: '20px' }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                <Typography variant="h4">Upload AOM Documents</Typography>
                <BreadCrumbs />
            </Box>
        </Stack>
    </Box>
    <AOMDocumentsData />
</Fragment>
  )
}

export default UploadAOMDocuments