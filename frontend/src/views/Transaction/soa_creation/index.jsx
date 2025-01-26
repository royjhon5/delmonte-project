import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import BreadCrumbs from "../../../components/BreadCrumbs"
import DARdata from "./data"



const SOACreation = () => {
  return (
    <Fragment>
        <Helmet>
            <title>SOA Creation</title>
        </Helmet>
        <Box>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">SOA Creation</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
      <DARdata />
    </Fragment>
  )
}

export default SOACreation