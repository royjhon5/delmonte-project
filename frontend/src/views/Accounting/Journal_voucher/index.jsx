import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"


const JournalVoucherIssuance = () => {
  return (
    <Fragment>
        <Box sx={{ mb: '5px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Journal Voucher Issuance</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>

    </Fragment>
  )
}

export default JournalVoucherIssuance