import { Box, Button, Dialog, DialogContent, Grid, IconButton, TextField, useTheme } from "@mui/material"
import NoData from "../../../components/CustomDataTable/NoData";
import { useDispatch, useSelector } from "react-redux";
import { CASHVOUCHER_DATA, OPEN_VOUCHERSELECTION } from "../../../store/actions";
import CloseIcon from '@mui/icons-material/Close';
import { useGetCashVoucherHdr } from "../../../hooks/globalQuery";
import CustomDataGrid from "../../../components/CustomDataGrid";
import { useState } from "react";



const CashVoucherSelection = () => {
  const theme = useTheme();
  const open = useSelector((state) => state.customization.openVoucherSelection);
  const dispatch = useDispatch();
  const CloseDialog = () => {dispatch({ type: OPEN_VOUCHERSELECTION, openVoucherSelection: false })}
  const [search, setSearch] = useState('');
  const { data, loading } = useGetCashVoucherHdr();
  const constMappedData = Array.isArray(data) ? data.map((row) => {
    return { ...row, id: row.ID };
  }) : [];

  const SearchFilter = (rows) => {
    return rows.filter(row =>
        row.SeriesNo.toLowerCase().includes(search.toLowerCase()) || 
        row.PayeeName.toLowerCase().includes(search.toLowerCase())
    );
  };
  
  const ColumnHeader = [
    { field: 'SeriesNo', headerName: 'Series Number', flex: 1, },
    { field: 'PayeeName', headerName: 'Payee Name', flex: 1, },
    { field: "actions", headerAlign: 'right',
      headerName: '',    
      width: 150,
      align: 'right',
      renderCell: (params) => {
          const SelectData = () => {
            const entireData = params.row;
            dispatch({type: CASHVOUCHER_DATA, cashvoucherData: entireData});
            dispatch({ type: OPEN_VOUCHERSELECTION, openVoucherSelection: false }); 
          };
      return (
        <Box>
          <Button variant="contained" color="primary" size="small" onClick={SelectData}>Select</Button>
        </Box>
      )
      }
    }
  ];
  
  return (
    <>
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
          maxHeight={450}
          height={450}
          rows={SearchFilter(constMappedData)}
          slots={{ noRowsOverlay: NoData }}
          loading={loading}
        />
        </DialogContent>
    </Dialog>
    </>
  )
}

export default CashVoucherSelection