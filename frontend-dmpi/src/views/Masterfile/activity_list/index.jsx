import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import ActivityData from "./ActivityListData"


const ActivityList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Activity List List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Activity List List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ActivityData />
    </Fragment>
  )
}

export default ActivityList