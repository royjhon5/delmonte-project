import { Grid, Paper, TextField, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { hookContainer } from "../../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";


const BarchartStats = () => {
    const queryClient = useQueryClient();

    const initialDataVariable = {
        DocTypeLinkID: "",
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

    const { data: dataList } = hookContainer('get-dashboard-bar-statistics', dataVariable);
    const { data: docList } = hookContainer('get-document-type');

    const constMonthData = Array.isArray(dataList) ? dataList.map((row, index) => {
        return row.month;
    }) : [];

    const constCountData = Array.isArray(dataList) ? dataList.map((row, index) => {
        return row.count;
    }) : [];

    useEffect(() => {
        queryClient.invalidateQueries(['get-dashboard-bar-statistics']);
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
                            <Typography>Select Doc. Type & Year</Typography>
                        </Grid>
                        <Grid item xs={12} md={4.5}>
                            <TextField variant="filled" size="small" label="Document Type" select value={dataVariable.DocTypeLinkID} onChange={updateDataVariable} name="DocTypeLinkID" SelectProps={{ native: true, }} fullWidth>
                                <option></option>
                                {docList?.map((option) => (
                                    <option key={option.id} value={`${option.id}`}>
                                        {option.DTName}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4.5}>
                            <Grid item xs={12} md={4.5}>
                                <TextField variant="filled" size="small" label="Year" value={dataVariable.yearParam} onChange={updateDataVariable} name="yearParam" SelectProps={{ native: true, }} fullWidth inputProps={{ maxLength: 4 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: constMonthData }]}
                        series={[{ data: constCountData }]}
                        width={1200}
                        height={350}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default BarchartStats