import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import CheckVoucherData from "./CheckVoucherData"
import { Helmet } from "react-helmet-async"


const CheckVoucherIssuance = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Accounting: Check Voucher</title>
        </Helmet>
        <Box sx={{ mb: '5px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Check Voucher Issuance</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <CheckVoucherData />
    </Fragment>
  )
}

export default CheckVoucherIssuance