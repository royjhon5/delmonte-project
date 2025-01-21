import { Box, Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import FinancialDocumentsData from "./FinancialDocumentsData"

const UploadFinancialDocuments = () => {
  return (
    <Fragment>
    <Helmet>
        <title>Upload Documents: Financial</title>
    </Helmet>
    <Box sx={{ mb: '20px' }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                <Typography variant="h4">Upload Financial Documents</Typography>
                <BreadCrumbs />
            </Box>
        </Stack>
    </Box>
    <FinancialDocumentsData />
</Fragment>
  )
}

export default UploadFinancialDocuments