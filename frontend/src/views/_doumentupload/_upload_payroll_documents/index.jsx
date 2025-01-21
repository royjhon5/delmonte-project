import { Box, Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import PayrollData from "./PayrollDocumentsData"

const PayrollDocuments = () => {
  return (
    <Fragment>
    <Helmet>
        <title>Upload Documents: Payroll & Payslips</title>
    </Helmet>
    <Box sx={{ mb: '20px' }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                <Typography variant="h4">Upload Payroll & Payslips Documents</Typography>
                <BreadCrumbs />
            </Box>
        </Stack>
    </Box>
    <PayrollData />
</Fragment>
  )
}

export default PayrollDocuments