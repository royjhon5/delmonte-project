import { Box, Button, Dialog, DialogContent, Grid, IconButton, TextField, useTheme } from "@mui/material"
import NoData from "../../../components/CustomDataTable/NoData";
import { useDispatch, useSelector } from "react-redux";
import { OPEN_SUBDOCUMENT } from "../../../store/actions";
import CloseIcon from '@mui/icons-material/Close';
import CustomDataGrid from "../../../components/CustomDataGrid";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../../api/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VerifySwal from "../../../components/VerifySwal";




const AddSubDocument = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const open = useSelector((state) => state.customization.openSubDocument);
  const DocumentData = useSelector((state) => state.customization.documentTypeData);
  const dispatch = useDispatch();
  const CloseDialog = () => {dispatch({ type: OPEN_SUBDOCUMENT, openSubDocument: false }), setEditMode(false), setSubDocumentName('')}
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const [subDocumentName, setSubDocumentName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedID, setSelectedID] = useState(0);
  const [openDeleteSwal, setOpenDeleteSwal] = useState(false);

  const getSubDocument = async () => {
    setLoading(true)
    try {
      const response = await http.get('/get-sub-document-type', { params: { DocType_IDLink: DocumentData.id } })
      return response.data
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const { data } = useQuery({
    queryKey: ['subdocument'],
    queryFn: getSubDocument,
    enabled: open && !!DocumentData.id,  
  });

  const constMappedData = Array.isArray(data) ? data.map((row) => {
    return { ...row, id: row.id  };
  }) : [];

  const SearchFilter = (rows) => {
    return rows.filter(row =>
        row.subDocument_name.toLowerCase().includes(search.toLowerCase()));
  };

  const saveNewSubDocument = async  () => {
    const subDocumentData = { 
      id: editMode ? selectedID : 0 ,
      subDocument_name: subDocumentName,
      DocType_IDLink: DocumentData.id,
    };
    try {
      await saveSubDocument.mutateAsync(subDocumentData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const saveSubDocument = useMutation({
    mutationFn: (subDocumentData) => http.post('/save-sub-document-type', subDocumentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['treeHeader']);
      toast.success('New subdocument has been saved.');
      setSubDocumentName('');
      setEditMode(false);
    },
    onError: (error) => {
      toast.error(error)
    }
  });
  
  
  const ColumnHeader = [
    { field: 'subDocument_name', headerName: 'Sub Document Name', width: 450, 
        renderCell: (params) => (
            <Box sx={{paddingLeft:1}}>
              {params.row.subDocument_name}
            </Box>
          ),
    },
    { field: "actions", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (params) => {
        const SelectData = () => {
            setSelectedID(params.row.id)
            setSubDocumentName(params.row.subDocument_name);       
            setEditMode(true);
        };
      return (
        <Box sx={{paddingRight:1}}>
          <IconButton color="primary" size="small" onClick={SelectData}>
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => selectToDelete(params.row.id)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )
      }
    }
  ];


  const selectToDelete = (data) => {
    setSelectedID(data);
    setOpenDeleteSwal(true)
  }

  const deleteData = useMutation({
    mutationFn: () => http.delete(`/delete-subdocument?id=${selectedID}`),
    onSuccess: () => {
      toast.success('Data has been deleted successfully.');
      queryClient.invalidateQueries(['treeHeader']);
      setOpenDeleteSwal(false);
    }
  });
  
  const DeleteData = () => {
    deleteData.mutate(selectedID);
  };

  const closeSwal = () => {
    setOpenDeleteSwal(false)
  }
  
  return (
    <>
    <VerifySwal maxWidth="xs" open={openDeleteSwal} onClose={closeSwal} NoOnClick={closeSwal} YesOnClick={DeleteData} />
    <Dialog
    maxWidth="sm"
    fullWidth={true}
    onClose={CloseDialog} 
    open={open} 
    BackdropProps={{
        sx: {
          backgroundColor: 'rgba(22, 28, 36, 0.8)',
        }
    }}
    sx={{
        overflowY: 'auto',
        boxShadow: theme.palette.appSettings.paletteMode === 'dark' ? 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px' : 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px'
    }}
    >
        <DialogContent sx={{padding:0}}>
        <Grid container sx={{mb:1, padding:2}} spacing={1}>
            <Grid item xs={12} md={6} >
                <TextField label="Search" fullWidth value={search} size="small" onChange={(e) => {setSearch(e.target.value)}} />
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', justifyContent:'flex-end', alignItems: 'center'}}>
            <IconButton size="small" color="error" onClick={CloseDialog}><CloseIcon fontSize="small" /></IconButton>
            </Grid>
        </Grid>
        <CustomDataGrid 
          columns={ColumnHeader}
          gridOverLay={'400px'}
          height={400}
          rows={SearchFilter(constMappedData)}
          slots={{ noRowsOverlay: NoData }}
          loading={loading}
          hideFooter
        />
        <Box sx={{padding:1, display: 'flex', flexDirection: 'column', gap:1}}>
         <TextField fullWidth variant="filled" label="Sub Document Name" value={subDocumentName} onChange={(e) => {setSubDocumentName(e.target.value)}} /> 
         {editMode ? 
         <Button variant="contained" onClick={saveNewSubDocument}>Update</Button>
         :
         <Button variant="contained" onClick={saveNewSubDocument}>Save</Button>
         }
        </Box>
        </DialogContent>
    </Dialog>
    </>
  )
}

export default AddSubDocument