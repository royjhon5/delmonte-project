import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import EmployeeTemplatesData from "./EmployeeTemplatesData"



const EmployeeTemplates = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Employee Templates</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Employee Templates</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <EmployeeTemplatesData />
    </Fragment>
  )
}

export default EmployeeTemplates