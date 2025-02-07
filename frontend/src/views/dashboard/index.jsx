import { Helmet } from "react-helmet-async"
import { Typography } from '@mui/material'

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard: Overview</title>
      </Helmet>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>
    </>
  )
}

export default Dashboard