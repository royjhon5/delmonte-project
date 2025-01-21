import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Tab, Tabs } from '@mui/material';
import { Fragment, useState } from 'react';
import CustomTabPanel from '../../AccountSettings/CustomTabPanel';
import NewPeriod from './NewPeriod';

const CloseEntryData = () => {
  const [tabValue, setTabValue] = useState(0);
  const tabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  return (
    <Fragment>
    <Tabs value={tabValue} onChange={tabChange} sx={{mb:3}}>          
        <Tab icon={<NewReleasesIcon />} iconPosition="start"  label="New Period" disableRipple sx={{ minHeight: '48px', minWidth: '48px', marginRight: '40px', padding: 0}} />
    </Tabs>
    <CustomTabPanel value={tabValue} index={0}>
        <NewPeriod />
    </CustomTabPanel>
    </Fragment>
  )
}

export default CloseEntryData