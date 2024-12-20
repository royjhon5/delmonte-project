import { DataGrid, DataGridProps, GridOverlay } from '@mui/x-data-grid';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

type CustomDataGridProps = {
  columns: DataGridProps['columns'];
  rows: DataGridProps['rows'];
  slots?: DataGridProps['slots'];
  loading?: boolean;
  hideFooter?: boolean;
  hideFooterPagination?: boolean;
  maxHeight?: number;
  height?: number;
  gridOverLay?: string;
  onRowClick?: DataGridProps['onRowClick'];
};

const CustomLoadingOverlay: React.FC = () => (
  <GridOverlay>
      <CircularProgress />
  </GridOverlay>
);

const MuiDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  rows,
  slots,
  loading = false,
  hideFooter = false,
  hideFooterPagination = false,
  maxHeight,
  height,
  gridOverLay,
  onRowClick,
}) => {
  return (
    <DataGrid
      loading={loading}
      columns={columns}
      rows={rows}
      slots={{
        ...slots,
        loadingOverlay: CustomLoadingOverlay,
      }}
      rowHeight={47}
      rowSelection={false}
      disableRowSelectionOnClick={false}
      hoverStateEnabled={true}
      onRowClick={onRowClick}
      hideFooter={hideFooter}
      hideFooterPagination={hideFooterPagination}
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
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
        '& .MuiDataGrid-container--top [role=row]': {
          borderBottom: 'none'
        },
        '.MuiDataGrid-cell': {
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
  );
};

export default MuiDataGrid;
