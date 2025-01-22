import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import GLCodeData from "./GLCodeData"


const GLCodeList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>GL Code List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">GL Code List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <GLCodeData />
    </Fragment>
  )
}

export default GLCodeList