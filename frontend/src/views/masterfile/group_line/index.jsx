import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import GroupLineData from "./GroupLineData"


const GroupLineList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Group / Line List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Group / Line List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <GroupLineData />
    </Fragment>
  )
}

export default GroupLineList