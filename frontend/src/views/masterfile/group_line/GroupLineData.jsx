import { Box, Button, IconButton, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ISTOUPDATE_SCANNER, OPEN_ADDSCANNER, OPEN_DELETESWAL, SCANNER_TYPEOBJ } from "../../../store/actions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import http from "../../../api/http";
import { toast } from "sonner";
import AddGroupLine from "./_AddGroupLine";

const GroupLineData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { data: scannerData } = hookContainer('/get-group');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const constMappedData = Array.isArray(scannerData) ? scannerData.map((row) => {
      return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
      return rows.filter(row =>
          row.scannerName.toLowerCase().includes(search.toLowerCase()) || 
          row.dedicatedTempPath.toLowerCase().includes(search.toLowerCase())
      );
    };

    const ColumnHeader = [
    { field: 'groupline_name', headerName: 'Group Line Name', width: 450,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.scannerName}
        </Box>
      ),
     },
    { field: 'dedicatedTempPath', headerName: 'Dedicated Path Name', flex:1, },
    { field: "action", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (data) => {
          const SelectData = () => {
            const obj = {
              id: data.row.id,
              name: data.row.groupline_name,
            };
            dispatch({ type: SCANNER_TYPEOBJ, scannerData: obj });
            dispatch({ type: OPEN_ADDSCANNER, openAddScanner: true });
            dispatch({ type: ISTOUPDATE_SCANNER, isToUpdateScanner: true });
          };      
      return (
        <Box sx={{paddingRight:1}}>
          <IconButton color="primary" size="small" onClick={SelectData}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => selectToDelete(data.row.id)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )
      }
    }
  ];

  const openAddNewScanner = () => {
    dispatch({ type: OPEN_ADDSCANNER, openAddScanner: true });
  }
  const refreshData = () => queryClient.invalidateQueries(['/get-group']);

  const selectToDelete = (data) => {
    setSelectedID(data);
    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
  }

  const deleteData = useMutation({
    mutationFn: () => http.delete(`/delete-group?id=${selectedID}`),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries(['/get-scanner-list']);
      dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
    }
  });
  
  const DeleteData = () => {
    deleteData.mutate(selectedID);
  };

  return (
    <>
    <AddGroupLine RefreshData={refreshData} />
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Paper>
        <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => {setSearch(e.target.value)}} sx={{ width: { xl: '30%', lg: '30%' }}} />
            <Button variant="contained" onClick={openAddNewScanner}>Add Scanner</Button>
        </Stack>
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

export default GroupLineData