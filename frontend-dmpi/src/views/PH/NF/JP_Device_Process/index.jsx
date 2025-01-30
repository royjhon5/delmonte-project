import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../../components/BreadCrumbs"
import DataContainer from "./DataContainer"


const UpdateExportEmployeeLocation = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Export / Update Employee Location</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Export / Update Employee Location</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <DataContainer />
    </Fragment>
  )
}

export default UpdateExportEmployeeLocation