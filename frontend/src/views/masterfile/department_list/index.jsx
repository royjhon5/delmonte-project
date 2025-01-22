import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import DepartmentListData from "./DepartmentListData"


const DepartmentList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Department List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Department List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <DepartmentListData />
    </Fragment>
  )
}

export default DepartmentList