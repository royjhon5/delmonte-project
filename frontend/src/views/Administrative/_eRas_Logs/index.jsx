import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import LogsData from "./LogsData"


const SystemLogs = () => {
  return (
    <Fragment>
        <Helmet>
            <title>System Logs</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">eRas Logs</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <LogsData />
    </Fragment>
  )
}

export default SystemLogs