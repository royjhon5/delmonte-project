import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import CashVoucherData from "./CashVoucherData"
import { Helmet } from "react-helmet-async"


const CashVoucherIssuance = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Accounting: Cash Voucher</title>
        </Helmet>
        <Box sx={{ mb: '5px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Cash Voucher Issuance</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <CashVoucherData />
    </Fragment>
  )
}

export default CashVoucherIssuance