import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import UserListData from "./UserListData"



const UserList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>User List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">User List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <UserListData />
    </Fragment>
  )
}

export default UserList