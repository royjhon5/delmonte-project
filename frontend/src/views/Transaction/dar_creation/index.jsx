import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import DARdata from "./data"



const DARPreparation = () => {
  return (
    <Fragment>
        <Helmet>
            <title>DAR Preparation</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">DAR Preparation</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
      <DARdata />
    </Fragment>
  )
}

export default DARPreparation