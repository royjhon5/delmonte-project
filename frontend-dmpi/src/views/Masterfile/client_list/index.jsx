import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import ClientListData from "./ClientListData"


const ClientList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Client List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Client List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ClientListData />
    </Fragment>
  )
}

export default ClientList