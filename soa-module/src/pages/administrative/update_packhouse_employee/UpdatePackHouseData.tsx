// import { DataTableDemo } from "@/components/custom/DataTable/DataTable";

import MuiDataGrid from "@/components/custom/MUI-Datagrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customQuery } from "@/hooks/customHook";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

export default function UpdatePackhouseEmployeeData() {
    const [search, setSearch] = useState('');
    const { data: employeeMasterfile, loading } = customQuery('/get-employeemasterfile');
    const constMappedData = Array.isArray(employeeMasterfile) ? employeeMasterfile.map((row) => {
        return { ...row, id: row.EmpID  };
    }) : [];

    const SearchFilter = (rows) => {
        return rows.filter(row =>
            row.ChapaID_Old .toLowerCase().includes(search.toLowerCase()) ||
            row.FName.toLowerCase().includes(search.toLowerCase()) ||
            row.MName.toLowerCase().includes(search.toLowerCase()) ||
            row.LName.toLowerCase().includes(search.toLowerCase())
        );
      };


    const ColumnHeader = [
        { field: 'ChapaID_Old', headerName: 'Chapa ID', flex: 1,
            renderCell: (params) => (
                <div className="pl-2">
                  {params.row.ChapaID_Old}
                </div>
            ),
        },
        { field: 'FName', headerName: 'Full name ', flex: 1,
            renderCell: (params) => (
                <div className="pl-2">
                  {params.row.FName} {params.row.MName} {params.row.LName }
                </div>
            ),
        },
        { field: "action", headerAlign: 'right',
          headerName: '',    
          width: 150,
          align: 'right',
          renderCell: () => {
              const SelectData = () => {
                const obj = {
                  id: data.row.id,
                  name: data.row.department_name,
                };  
          };      
          return (
            <Button>
                Set as Packhouse
            </Button>
          )
          }
        }
      ];

    return (
        <>
        <Card>
            <CardContent className="pt-0 pb-0 pl-1 pr-1">
                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="">
                    <Input placeholder="Search Chapa ID or Lastname..." value={search} onChange={(e) => {setSearch(e.target.value)}} />
                    </div>
                </div>
                <div className="p-0">
                    <MuiDataGrid 
                        columns={ColumnHeader}
                        rows={SearchFilter(constMappedData)}
                        maxHeight={550}
                        height={550}    
                        loading={loading} 
                    />
                </div>
            </CardContent>
        </Card>
        </>
    )
}