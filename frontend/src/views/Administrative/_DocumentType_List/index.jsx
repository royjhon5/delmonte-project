import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"

import { Helmet } from "react-helmet-async"
import DocumentTypeData from "./DocumentTypeData"
import BreadCrumbs from "../../../components/BreadCrumbs"


const DocumentTypeList = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Document Type List</title>
        </Helmet>
        <Box sx={{ mb: '20px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', }}>
                    <Typography variant="h4">Document Type List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <DocumentTypeData />
    </Fragment>
  )
}

export default DocumentTypeList