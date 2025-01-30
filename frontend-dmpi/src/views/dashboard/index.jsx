import { Grid } from "@mui/material"
import { Helmet } from "react-helmet-async"
import BarchartStats from "./Statistics/BarchartStats"
import PieChartStats from "./Statistics/PieChartStats"
import StorageCapacity from "./Statistics/StorageCapacity"

const Dashboard = () => {


  return (
    <>
      <Helmet>
        <title>Dashboard: Overview</title>
      </Helmet>
      {/* <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <PieChartStats />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarchartStats />
        </Grid>
        <Grid item xs={12} md={12}>
          <StorageCapacity />
        </Grid>
      </Grid> */}
    </>
  )
}

export default Dashboard