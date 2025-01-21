import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { Helmet } from "react-helmet-async"
import CloseEntryData from "./CloseEntryData"



const CloseEntryList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Dashboard: Close Period Entries</title>
        </Helmet>
        <Box sx={{ mb: '40px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4">Close Period Entries</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <CloseEntryData />
    </Fragment>
  )
}

export default CloseEntryList