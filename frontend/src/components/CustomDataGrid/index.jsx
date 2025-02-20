import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';

const CustomDataGrid = ({ columns, 
  rows, slots, 
  loading, hideFooter, 
  hideFooterPagination, 
  maxHeight, height, 
  gridOverLay, onRowClick, 
  columnGroupingModel, checkboxSelection,
  rowSelection, disableRowSelectionOnClick,
  onRowSelectionModelChange }) => {
  const theme = useTheme();
  return (
    <DataGrid
      columnHeaderHeight={36}
      loading={loading}
      columns={columns}
      rows={rows}
      slots={slots}
      checkboxSelection={checkboxSelection}
      rowHeight={36}
      rowSelection={rowSelection}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      hoverStateEnabled={true}
      onRowClick={onRowClick}
      hideFooter={hideFooter}
      columnGroupingModel={columnGroupingModel}
      hideFooterPagination={hideFooterPagination}
      onRowSelectionModelChange={onRowSelectionModelChange}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      
      pageSizeOptions={[25, 50, 100]}
      sx={{
        '--DataGrid-overlayHeight': gridOverLay,
        borderRadius: 0,
        height: height,
        maxHeight: maxHeight,
        '.MuiDataGrid-columnSeparator': {
          // display: 'none',
        },
        '&.MuiDataGrid-root': {
          border: 0,
          borderBottom: theme.palette.appSettings.paletteMode === 'dark' ? '1px solid rgba(81, 81, 81, 1)' : '1px solid rgba(224, 224, 224, 1)',
        },
        '& .MuiDataGrid-container--top [role=row]': {
          background: theme.palette.appSettings.paletteMode === 'dark' ? 'rgb(40,50,61)' : '',
          borderBottom: 'none'
        },
        '.MuiDataGrid-cell': {
          borderBottom: theme.palette.appSettings.paletteMode === 'dark' ? '1px dashed rgb(46, 50, 54)' : '1px dashed rgb(241, 243, 244)',
          borderTop: 'none',
          padding: 0
        },
        '.MuiDataGrid-main': {
          border: 0,
        },
        '.css-1jlz3st': {
          borderTop: '0px',
        },
        '.css-ybzqx9-MuiDataGrid-root': {
          '--DataGrid-rowBorderColor': {
            border: 0
          }
        },
        "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
          outline: "none !important"
        }
      }}
    />
  )
}

CustomDataGrid.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  slots: PropTypes.object,
  loading: PropTypes.bool,
  hideFooter: PropTypes.bool,
  hideFooterPagination: PropTypes.bool,
  maxHeight: PropTypes.number,
  height: PropTypes.number,
  gridOverLay: PropTypes.string,
  onRowClick: PropTypes.any,
  columnGroupingModel: PropTypes.array,
  checkboxSelection: PropTypes.bool,
  disableRowSelectionOnClick: PropTypes.bool,
  rowSelection: PropTypes.bool,
  onRowSelectionModelChange: PropTypes.func
}


export default CustomDataGrid