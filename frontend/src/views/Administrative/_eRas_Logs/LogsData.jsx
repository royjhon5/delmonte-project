import { Box, Paper, TextField, Grid, Button } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const LogsData = () => {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const initialDataVariable = {
        DateFrom: "",
        DateTo: "",
    }

    const [dataVariable, setDataVariable] = useState(initialDataVariable);
    const updateDataVariable = e => {
        const { name, value } = e.target;
        setDataVariable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const { data: logsData } = hookContainer('/get-audit-log', { dataVariable });

    const searchData = (event) => {
        event.preventDefault();
        queryClient.invalidateQueries(['get-audit-log']);
    }

    const constMappedData = Array.isArray(logsData) ? logsData.map((row) => {
        return { ...row, id: row.id };
    }) : [];

    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.action.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ColumnHeader = [
        {
            field: 'audit_datetime', headerName: 'Date / Time', width: 350,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.audit_datetime}
                </Box>
            ),
        },
        {
            field: 'interface', headerName: 'Menu', width: 450,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.interface}
                </Box>
            ),
        },
        {
            field: 'action', headerName: 'Action', width: 550,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.action}
                </Box>
            ),
        },
        {
            field: 'audit_log_display', headerName: 'Audited By', width: 400,
            renderCell: (params) => (
                <Box sx={{ paddingLeft: 1 }}>
                    {params.row.audit_log_display}
                </Box>
            ),
        },
    ];

    return (
        <>
            <Paper sx={{ gap: 1 }}>
                <Box sx={{padding:2}}>
                <form onSubmit={searchData}>
                    <Grid container spacing={1} sx={{ padding: 2, paddingLeft: 0, paddingBottom: 0 }}>
                        <Grid item xs={12} md={3}>
                            <TextField variant="outlined" type="date" fullWidth size="small" label="Date From" value={dataVariable.DateFrom} onChange={updateDataVariable} name="DateFrom" InputLabelProps={{ shrink: true }} required />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField variant="outlined" type="date" fullWidth size="small" label="Date To" value={dataVariable.DateTo} onChange={updateDataVariable} name="DateTo" InputLabelProps={{ shrink: true }} required />
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Button sx={{ height: '100%' }} type="submit" size="large" color="success" variant="contained">Go</Button>
                        </Grid>
                    </Grid>
                </form>
                <Grid container spacing={1} sx={{ padding: 2, paddingLeft: 0 }}>
                    <Grid item xs={12} md={3}>
                        <TextField variant='outlined' label="Search Audit By" fullWidth size='small' value={search} onChange={(e) => { setSearch(e.target.value) }} />
                    </Grid>
                </Grid>
                </Box>
                <CustomDataGrid
                    columns={ColumnHeader}
                    maxHeight={450}
                    height={450}
                    rows={SearchFilter(constMappedData)}
                    slots={{ noRowsOverlay: NoData }}
                />
            </Paper>
        </>
    )
}

export default LogsData