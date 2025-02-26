import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import ViewUserList from "./ViewUserList"



const ViewUserListIndex = () => {
  return (
    <Fragment>
        <Helmet>
            <title>View User List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">View User List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ViewUserList />
    </Fragment>
  )
}

export default ViewUserListIndex