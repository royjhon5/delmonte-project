import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import CostCenterData from "./CostCenterData"


const CostCenterList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Cost Center List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Cost Center List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <CostCenterData />
    </Fragment>
  )
}

export default CostCenterList