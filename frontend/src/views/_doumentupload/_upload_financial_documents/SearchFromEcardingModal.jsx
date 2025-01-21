import { useState, useEffect } from "react";
import { Button, DialogActions, Grid, TextField } from "@mui/material";
import http from "../../../api/http";
import { toast } from "sonner";
import NoData from "../../../components/CustomDataTable/NoData";
import CustomDataGrid from "../../../components/CustomDataGrid";
import MainModal from "../../../components/MainModal/MainModal.jsx";
import { hookContainer } from "../../../hooks/globalQuery";
import LoadSaving from "../../../components/LoadSaving/Loading.jsx";

const SearchFromEcardingModal = (props) => {
	const { openModal, setOpen, onCloseModal } = props;
	const [loadSaving, setLoadSaving] = useState(false);

	const initialDataVariable = {
		DVNo: "",
		DateFrom: "",
		DateTo: "",
		FilterType: "",
		CheckNo: "",
		Payee: "",
	};

	const [tableData, setTableData] = useState([]);
	const constMappedData = Array.isArray(tableData) ? tableData.map((row) => {
		return { ...row, id: row.THdrID };
	}) : [];

	const [dataVariable, setDataVariable] = useState(initialDataVariable);
	const updateDataVariable = e => {
		const { name, value } = e.target;
		setDataVariable(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const clearData = async () => {
		setDataVariable(initialDataVariable);
		setTableData([]);
	}

	const getDVNoFromEcarding = async (event) => {
		setTableData([]);
		event.preventDefault();
		try {
			setLoadSaving("Searching...");
			const response = await http.get('/browse-from-ecarding', {
				params: {
					dataVariable
				}
			});
			if (!response.data.message) setTableData(response.data);
			else toast.error(response.data.message);
			setLoadSaving(false);
		} catch (error) {
			console.error(error);
			toast.error('Connection failed!');
			setLoadSaving(false);
		} finally {
			setLoadSaving(false);
		}
	};

	const ColumnHeader = [
		{ field: 'DVNo', headerName: 'DV No', width: 200 },
		{ field: 'DVDate', headerName: 'DV Date', width: 210 },
		{ field: 'ORSNo', headerName: 'ORS No', width: 220 },
		{ field: 'Office', headerName: 'Office', width: 700 },
		{ field: 'Status', headerName: 'Status', width: 150 },
	];

	// search filter
	const SearchFilter = (rows) => {
		return rows.filter(row =>
			row.scannerName.toLowerCase().includes(search.toLowerCase()) ||
			row.dedicatedTempPath.toLowerCase().includes(search.toLowerCase())
		);
	};

	return (
		<>
			{loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
			<MainModal
				title="Search From Ecarding"
				open={openModal}
				setOpen={() => { setOpen(false); clearData(); }}
				viewSize="xl"
			>
				<form onSubmit={getDVNoFromEcarding}>
					<Grid container sx={{ mb: 1, paddingTop: 1 }} spacing={1}>
						<Grid item xs={12} md={3}>
							<TextField variant="filled" size="small" label="Filter Type" select value={dataVariable.FilterType} onChange={updateDataVariable} name="FilterType" SelectProps={{ native: true, }} fullWidth>
								<option></option>
								<option value="1">By DV No</option>
								<option value="2">By Date Range</option>
								<option value="3">Payee</option>
								<option value="4">Check No</option>
							</TextField>
						</Grid>
						{dataVariable.FilterType == 1 ?
							<Grid item xs={12} md={4} >
								<TextField variant="filled" fullWidth size="small" label="Search DV Number" value={dataVariable.DVNo} onChange={updateDataVariable} name="DVNo" required />
							</Grid> : ""
						}
						{dataVariable.FilterType == 2 ?
							<Grid item xs={12} md={4} >
								<TextField variant="filled" type="date" fullWidth size="small" label="Date From" value={dataVariable.DateFrom} onChange={updateDataVariable} name="DateFrom" InputLabelProps={{ shrink: true }} required />
							</Grid> : ""
						}
						{dataVariable.FilterType == 2 ?
							<Grid item xs={12} md={4} >
								<TextField variant="filled" type="date" fullWidth size="small" label="Date To" value={dataVariable.DateTo} onChange={updateDataVariable} name="DateTo" InputLabelProps={{ shrink: true }} required />
							</Grid> : ""
						}
						{dataVariable.FilterType == 3 ?
							<Grid item xs={12} md={4} >
								<TextField variant="filled" fullWidth size="small" label="Search Payee" value={dataVariable.Payee} onChange={updateDataVariable} name="Payee" required />
							</Grid> : ""
						}
						{dataVariable.FilterType == 4 ?
							<Grid item xs={12} md={4} >
								<TextField variant="filled" fullWidth size="small" label="Search Check Number" value={dataVariable.CheckNo} onChange={updateDataVariable} name="CheckNo" required />
							</Grid> : ""
						}
						{dataVariable.FilterType != '' ?
							<Grid item xs={12} md={1}>
								<Button sx={{ height: '100%' }} type="submit" size="large" color="success" variant="contained">Go</Button>
							</Grid> : ""
						}
					</Grid>
				</form>
				<CustomDataGrid
					columns={ColumnHeader}
					maxHeight={450}
					height={450}
					rows={constMappedData}
					slots={{ noRowsOverlay: NoData }}
					onRowClick={(params) => {
						onCloseModal(params.row);
						setOpen(false);
						clearData();
					}}
				// loading={loading}
				/>
			</MainModal>
		</>
	)
}

export default SearchFromEcardingModal
