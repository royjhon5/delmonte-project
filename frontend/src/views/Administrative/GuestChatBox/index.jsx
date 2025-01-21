import { Fragment } from "react"
import { Box, Stack, Typography } from '@mui/material'
import BreadCrumbs from "../../../components/BreadCrumbs"
import ChatBoxContainer from "./ChatBoxContainer"

const GuestChatBox = () => {
  return (
    <Fragment>
        <Box sx={{ mb: '40px'}}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                    <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h4">Message Inbox</Typography>
                    <BreadCrumbs />
                </Box>
            </Stack>
        </Box>
        <ChatBoxContainer />
    </Fragment>
  )
}

export default GuestChatBox