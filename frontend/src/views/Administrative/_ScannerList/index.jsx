import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import ScannerListData from "./ScannaerListData"


const ScannerList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Scanner List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Scanner List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ScannerListData />
    </Fragment>
  )
}

export default ScannerList