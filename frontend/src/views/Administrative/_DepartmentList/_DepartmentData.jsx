import { Box, Button, IconButton, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DEPARTMENT_LISTOBJ, ISTOUPDATE_DEPT, OPEN_ADDDEPARTMENT, OPEN_DELETESWAL } from "../../../store/actions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddDepartment from "./_AddDepartment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteSwal from "../../../components/Swal/DeleteSwal";
import http from "../../../api/http";
import { toast } from "sonner";

const DepartmentListData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { data: departmentData } = hookContainer('/get-department');
    const queryClient = useQueryClient();
    const [selectedID, setSelectedID] = useState(0);
    const constMappedData = Array.isArray(departmentData) ? departmentData.map((row) => {
      return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
      return rows.filter(row =>
          row.department_name.toLowerCase().includes(search.toLowerCase())
      );
    };

    const ColumnHeader = [
    { field: 'department_name', headerName: 'Department Name', flex: 1,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.department_name}
        </Box>
      ),
     },
    { field: "action", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (data) => {
          const SelectData = () => {
            const obj = {
              id: data.row.id,
              name: data.row.department_name,
            };
            dispatch({ type: DEPARTMENT_LISTOBJ, departmentData: obj });
            dispatch({ type: OPEN_ADDDEPARTMENT, openDepartment: true });
            dispatch({ type: ISTOUPDATE_DEPT, isToUpdateDepartment: true });
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

  const openAddNewScanner = () => dispatch({ type: OPEN_ADDDEPARTMENT, openDepartment: true });
  const refreshData = () => queryClient.invalidateQueries(['/get-department']);

  const selectToDelete = (data) => {
    setSelectedID(data);
    dispatch({ type: OPEN_DELETESWAL, confirmDelete: true });
  }

  const deleteData = useMutation({
    mutationFn: () => http.delete(`/delete-department?id=${selectedID}`),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries(['/get-department']);
      dispatch({ type: OPEN_DELETESWAL, confirmDelete: false })
    }
  });
  
  const DeleteData = () => {
    deleteData.mutate(selectedID);
  };

  return (
    <>
    <AddDepartment RefreshData={refreshData} />
    <DeleteSwal maxWidth="xs" onClick={DeleteData} />
    <Paper>
        <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => {setSearch(e.target.value)}} sx={{ width: { xl: '30%', lg: '30%' }}} />
            <Button variant="contained" onClick={openAddNewScanner}>Add Department</Button>
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

export default DepartmentListData