import { useState, useEffect } from "react";
import { Button, DialogActions, Grid, TextField } from "@mui/material";
import http from "../../../api/http.jsx";
import { toast } from "sonner";
import NoData from "../../../components/CustomDataTable/NoData.jsx";
import CustomDataGrid from "../../../components/CustomDataGrid/index.jsx";
import MainModal from "../../../components/MainModal/MainModal.jsx";
import { hookContainer } from "../../../hooks/globalQuery.jsx";
import LoadSaving from "../../../components/LoadSaving/Loading.jsx";

const SearchPayeeModal = (props) => {
	const { openModal, setOpen, onCloseModal } = props;
	const [loadSaving, setLoadSaving] = useState(false);

	const initialDataVariable = {
		Payee: "",
	};

	const [tableData, setTableData] = useState([]);
	const constMappedData = Array.isArray(tableData) ? tableData.map((row) => {
		return { ...row, id: row.payeeID };
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

	const searchData = async (event) => {
		setTableData([]);
		event.preventDefault();
		try {
			setLoadSaving("Searching...");
			const response = await http.get('/payee-from-ecarding', {
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
		{ field: 'name', headerName: 'Payee', width: 650 },
		{ field: 'address', headerName: 'Address', width: 500 },
	];

	// search filter
	const SearchFilter = (rows) => {
		return rows.filter(row =>
			row.name.toLowerCase().includes(search.toLowerCase())
		);
	};

	return (
		<>
			{loadSaving ? <div className="wrapper-bg"><LoadSaving title={loadSaving} /></div> : ''}
			<MainModal
				title="Search Payee"
				open={openModal}
				setOpen={() => { setOpen(false); clearData(); }}
				viewSize="lg"
			>
				<form onSubmit={searchData}>
					<Grid container sx={{ mb: 1, paddingTop: 1 }} spacing={1}>
						<Grid item xs={12} md={4} >
							<TextField variant="filled" fullWidth size="small" label="Search Payee Name" value={dataVariable.Payee} onChange={updateDataVariable} name="Payee" required />
						</Grid>
						<Grid item xs={12} md={1}>
							<Button sx={{ height: '100%' }} type="submit" size="large" color="success" variant="contained">Go</Button>
						</Grid>
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

export default SearchPayeeModal
