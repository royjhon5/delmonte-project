import { Grid, Paper, TextField, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { hookContainer } from "../../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function valueLabelFormat(value) {
    const units = ['KB', 'MB', 'GB', 'TB'];
  
    let unitIndex = 0;
    let scaledValue = value;
  
    while (scaledValue >= 1024 && unitIndex < units.length - 1) {
      unitIndex += 1;
      scaledValue /= 1024;
    }
  
    return `${scaledValue.toFixed(2)} ${units[unitIndex]}`;
  }

const PieChartStats = () => {
    const queryClient = useQueryClient();

    const initialDataVariable = {
        monthParam: getDateNow("month"),
        yearParam: getDateNow("year")
    }

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const { data: dataList } = hookContainer('get-dashboard-pie-statistics', dataVariable);

    const constMappedData = Array.isArray(dataList) ? dataList.map((row, index) => {
        return { id: index, value: row.count, label: row.DTName + " - " + valueLabelFormat(row.total_fileSize) };
    }) : [];

    useEffect(() => {
        queryClient.invalidateQueries(['get-dashboard-pie-statistics']);
    })

    function getDateNow(type = "date") {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (type == "date") return `${year}-${month}-${day}`;
        if (type == "year") return `${year}`;
        if (type == "day") return `${day}`;
        if (type == "month") return `${month}`;
        if (type == "hour") return `${hour}`;
        if (type == "minute") return `${minute}`;
        if (type == "second") return `${second}`;
        return false;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography>Select Month - Year</Typography>
                        </Grid>
                        <Grid item xs={12} md={4.5}>
                            <TextField variant="filled" size="small" label="Month" select value={dataVariable.monthParam} onChange={updateDataVariable} name="monthParam" SelectProps={{ native: true, }} fullWidth>
                                <option></option>
                                <option value="1">JANUARY</option>
                                <option value="2">FEBRUARY</option>
                                <option value="3">MARCH</option>
                                <option value="4">APRIL</option>
                                <option value="5">MAY</option>
                                <option value="6">JUNE</option>
                                <option value="7">JULY</option>
                                <option value="8">AUGUST</option>
                                <option value="9">SEPTEMBER</option>
                                <option value="10">OCTOBER</option>
                                <option value="11">NOVEMBER</option>
                                <option value="12">DECEMBER</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4.5}>
                            <TextField variant="filled" size="small" label="Year" value={dataVariable.yearParam} onChange={updateDataVariable} name="yearParam" SelectProps={{ native: true, }} fullWidth inputProps={{ maxLength: 4 }} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <PieChart
                        series={[
                            {
                                data: constMappedData,
                            },
                        ]}
                        width={1000}
                        height={350}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default PieChartStats