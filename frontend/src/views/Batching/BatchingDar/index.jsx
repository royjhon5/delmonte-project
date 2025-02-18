import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import BatchingDarData from "./BatchingDarData"


const BatchingDar  = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Batching DAR</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Batching DAR</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <BatchingDarData />
    </Fragment>
  )
}

export default BatchingDar