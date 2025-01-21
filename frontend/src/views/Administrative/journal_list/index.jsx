import { Box,Stack, Typography } from "@mui/material"
import { Fragment } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import JournalData from "./JournalData"
import { Helmet } from "react-helmet-async"



const Journal_List = () => {
  return (
    <Fragment>
        <Helmet>
            <title>Dashboard: Journalbook List</title>
        </Helmet>
        <Box sx={{ mb: '40px' }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4">JournalBook List</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <JournalData />
    </Fragment>
  )
}

export default Journal_List