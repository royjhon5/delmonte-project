import { Box, Button, Paper, Stack, TextField } from "@mui/material"
import CustomDataGrid from "../../../components/CustomDataGrid";
import NoData from "../../../components/CustomDataTable/NoData";
import { hookContainer } from "../../../hooks/globalQuery";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DOCUMENT_TYPEOBJ, OPEN_SUBDOCUMENT } from "../../../store/actions";
import AddSubDocument from "./_AddSubDocument";
import DeleteSwal from "../../../components/Swal/DeleteSwal";

const DocumentTypeData = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { data: documentTypeData } = hookContainer('/get-document-type');
    const constMappedData = Array.isArray(documentTypeData) ? documentTypeData.map((row) => {
      return { ...row, id: row.id };
    }) : [];
    const SearchFilter = (rows) => {
      return rows.filter(row =>
          row.DTName.toLowerCase().includes(search.toLowerCase()) || 
          row.DTAcronym.toLowerCase().includes(search.toLowerCase())
      );
    };

    const ColumnHeader = [
    { field: 'DTName', headerName: 'Document Name', width: 450,
      renderCell: (params) => (
        <Box sx={{paddingLeft:1}}>
          {params.row.DTName}
        </Box>
      ),
     },
    { field: 'DTAcronym', headerName: 'Acronym', flex:1, },
    { field: "actDTAcronymions", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (data) => {
          const SelectData = () => {
            const obj = {
              id: data.row.id,
              name: data.row.DTName,
              code: data.row.DTAcronym,
            };
            dispatch({ type: DOCUMENT_TYPEOBJ, documentTypeData: obj });
            dispatch({ type: OPEN_SUBDOCUMENT, openSubDocument: true });
          };      
      return (
        <Box sx={{paddingRight:1}}>
          <Button variant="contained" color="primary" size="small" onClick={SelectData}>Add Sub Document</Button>
        </Box>
      )
      }
    }
  ];
  return (
    <>
    <AddSubDocument />
    <DeleteSwal />
    <Paper>
        <Stack sx={{ display: 'flex', padding: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextField variant='outlined' label="Search" size='small' value={search} onChange={(e) => {setSearch(e.target.value)}} sx={{ width: { xl: '30%', lg: '30%' }}} />
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

export default DocumentTypeData