// import { DataTableDemo } from "@/components/custom/DataTable/DataTable";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppDispatch } from "@/store";
import { openThisDialog } from "@/store/features/openDialog";
import { DeleteIcon, EditIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import AddLocation from "./AddLocation";
import { IconButton } from "@mui/material";
import MuiDataGrid from "@/components/custom/MUI-Datagrid";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { customQuery } from "@/hooks/customHook";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";



const LocationData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const { data: locationData, isLoading } = customQuery('/get-location');
    const constMappedData = Array.isArray(locationData) ? locationData.map((row) => {
        return { ...row, id: row.id  };
    }) : [];

    interface Row {
      location_name: string;
    }

    const SearchFilter = (rows: Row[]): Row[] => {
        return rows.filter(row =>
            row.location_name.toLowerCase().includes(search.toLowerCase())
        );
    };
    const DataGridHeader = [
        { field: 'location_name', headerName: 'Location Name', flex: 1,
          renderCell: (params: GridRenderCellParams) => (
            <div className="pr-1">
              {params.row.location_name}
            </div>
          ),
         },
        { field: "action", headerAlign: 'right',
          headerName: '',    
          width: 150,
          align: 'right',
          renderCell: (params: GridRenderCellParams) => {   
            const SelectedRow = () => {
              <>
              </>
            }
          return (
            <div className="pr-1">
              <IconButton color="primary" size="small" onClick={SelectedRow}>
                <Pencil size={16} strokeWidth={1} />
              </IconButton>
              <IconButton color="error" size="small">
                <Trash2 size={16} strokeWidth={1} />
              </IconButton>
            </div>
          )
          }
        }
      ];

      const invalidateData = () => {
        queryClient.invalidateQueries(['/get-location']);
      }

    return (
        <>
        <AddLocation RefreshData={invalidateData} />
        <Card>
            <CardContent className="pt-0 pb-0 pl-1 pr-1">
                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="">
                    <Input placeholder="Search..." value={search} onChange={(e) => {setSearch(e.target.value)}} />
                    </div>
                    <div className="flex col-span-2 justify-end">
                        <Button onClick={() => dispatch(openThisDialog())}><Plus/>Add</Button>
                    </div>
                </div>
                <div className="p-2">
                    <MuiDataGrid 
                        columns={DataGridHeader}
                        rows={SearchFilter(constMappedData)}
                        maxHeight={550}
                        height={550}  
                        loading={isLoading}
                    />
                </div>
            </CardContent>
        </Card>
        </>
    )
}

export default LocationData