import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";

const CustomDataGrid = ({
  columns,
  rows,
  slots,
  loading,
  hideFooter,
  hideFooterPagination,
  maxHeight,
  height,
  gridOverLay,
  onRowClick,
  columnGroupingModel,
  checkboxSelection,
  rowSelection,
  disableRowSelectionOnClick,
  onRowSelectionModelChange,
  getRowClassName,
  isRowSelectable,
  rowSelectionModel
}) => {
  const theme = useTheme();
  const customGetRowClassName = (params) => {
    let baseClass = getRowClassName ? getRowClassName(params) : "";
    return params.isSelected ? `${baseClass} checked-row` : baseClass;
  };
  return (
    <DataGrid
      columnHeaderHeight={30}
      loading={loading}
      columns={columns}
      rows={rows}
      slots={slots}
      checkboxSelection={checkboxSelection}
      rowHeight={30}
      rowSelection={rowSelection}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      hoverStateEnabled={true}
      onRowClick={onRowClick}
      hideFooter={hideFooter}
      columnGroupingModel={columnGroupingModel}
      hideFooterPagination={hideFooterPagination}
      onRowSelectionModelChange={onRowSelectionModelChange}
      isRowSelectable={isRowSelectable}
      rowSelectionModel={rowSelectionModel}
      getRowClassName={customGetRowClassName}
      sx={{
        "& .checked-row": {
          backgroundColor: "rgba(255, 0, 0, 0.3) !important",
        },
        "--DataGrid-overlayHeight": gridOverLay,
        borderRadius: 0,
        height: height,
        maxHeight: maxHeight,
        fontSize: '12px',
        "&.MuiDataGrid-root": {
          border: 0,
          borderBottom:
            theme.palette.appSettings.paletteMode === "dark"
              ? "1px solid rgba(81, 81, 81, 1)"
              : "1px solid rgba(224, 224, 224, 1)",
        },
        "& .MuiDataGrid-container--top [role=row]": {
          background:
            theme.palette.appSettings.paletteMode === "dark"
              ? "rgb(40,50,61)"
              : "",
          borderBottom: "none",
        },
        ".MuiDataGrid-cell": {
          borderBottom:
            theme.palette.appSettings.paletteMode === "dark"
              ? "1px dashed rgb(46, 50, 54)"
              : "1px dashed rgb(241, 243, 244)",
          borderTop: "none",
          padding: 0,
        },
        '& .Mui-selected': {
          backgroundColor: 'red !important',
          color: 'white',
        },
      }}
    />
  );
};

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
  onRowSelectionModelChange: PropTypes.func,
  getRowClassName: PropTypes.array,
  isRowSelectable: PropTypes.bool,
  rowSelectionModel: PropTypes.array,
};

export default CustomDataGrid;
