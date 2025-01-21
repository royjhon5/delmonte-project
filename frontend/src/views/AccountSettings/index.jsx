import { Box, Tab, Tabs, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import GeneralIcon from '../../components/svg-icons/GeneralIcon';
import NotifAccSett from '../../components/svg-icons/NotifAccSett';
import SecurityIcon from '../../components/svg-icons/SecurityIcon';
import CustomTabPanel from './CustomTabPanel'
import GeneralTab from './General';
import BreadCrumbs from '../../components/BreadCrumbs';
const AccountSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const tabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  return (
    <Fragment>
        <Box sx={{ mb: '40px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4">Account Settings</Typography>
            <BreadCrumbs />
        </Box>
        <Tabs value={tabValue} onChange={tabChange} >          
            <Tab icon={<GeneralIcon />} iconPosition="start"  label="General" disableRipple sx={{ minHeight: '48px', minWidth: '48px', marginRight: '40px', padding: 0}} />
            <Tab icon={<NotifAccSett />} iconPosition="start" label="Notification" disableRipple sx={{ minHeight: '48px', minWidth: '48px', marginRight: '40px', padding: 0}} />
            <Tab icon={<SecurityIcon />} iconPosition="start"  label="Scurity" disableRipple  sx={{ minHeight: '48px', minWidth: '48px', marginRight: '40px', padding: 0}}/>         
        </Tabs>
        <CustomTabPanel value={tabValue} index={0}>
            <GeneralTab />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
            Item One2
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
            Item One3
        </CustomTabPanel>
    </Fragment>
  )
}

export default AccountSettings