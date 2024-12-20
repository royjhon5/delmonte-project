import http from "@/api/http";
import ConfirmDialog from "@/components/custom/CustomDialog/ConfirmDialog";
import CustomLoadingButton from "@/components/custom/CustomLoadingButton";
import XSDotFlash from "@/components/custom/DotFlash/xsDotflash";
import MuiDataGrid from "@/components/custom/MUI-Datagrid";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customQuery } from "@/hooks/customHook";
import { AppDispatch } from "@/store";
import { closeThisDialog, openThisDialog } from "@/store/features/openDialog";
import { Chip, Typography } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function UpdatePackhouseEmployeeData() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState('');
    const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
    const [selectedID, setSelectedID] = useState(0);
    const { data: employeeMasterfile, isLoading } = customQuery('/get-employeemasterfile');
    const constMappedData = Array.isArray(employeeMasterfile) ? employeeMasterfile.map((row) => {
        return { ...row, id: row.EmpID  };
    }) : [];

    interface Row {
        ChapaID_Old: string;
        FName: string;
        MName: string;
        LName: string;
    }

    const SearchFilter = (rows: Row[]): Row[] => {
        return rows.filter(row =>
            row.ChapaID_Old.toLowerCase().includes(search.toLowerCase()) ||
            row.FName.toLowerCase().includes(search.toLowerCase()) ||
            row.MName.toLowerCase().includes(search.toLowerCase()) ||
            row.LName.toLowerCase().includes(search.toLowerCase())
        );
    };

      type employeeData = {
        EmpID: number;
        IsPH: number;
      };
      
      const setAsPackhouseEmployee = async (EmpID: number) => {
        const employeeData: employeeData = { 
          EmpID,
          IsPH: 1,
        };
        setLoadingStates((prev) => ({ ...prev, [EmpID]: true }));
        try {
          await updateData.mutateAsync(employeeData);
        } catch (error) {
          console.error('Error saving cash voucher:', error);
          toast.error('Failed to save cash voucher.');
        } finally {
          setLoadingStates((prev) => ({ ...prev, [EmpID]: false }));
        }
      };
      
      const updateData = useMutation({
        mutationFn: (employeeData: employeeData) => http.post('/save-employeemasterfile', employeeData),
        onSuccess: () => {
          queryClient.invalidateQueries(['/get-employeemasterfile']);
          toast.success('Employee status has successfully updated!');
          dispatch(closeThisDialog());
          
        },
        onError: (error: any) => {
          toast.error(error.message || 'An error occurred.');
        },
      });


    const ColumnHeader = [
        { field: 'ChapaID_Old', headerName: 'Chapa ID', width: 250,
            renderCell: (params: GridRenderCellParams) => (
                <div className="pl-2">
                  {params.row.ChapaID_Old}
                </div>
            ),
        },
        { field: 'FName', headerName: 'Full name ', flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div className="pl-2">
                  {params.row.FName} {params.row.MName} {params.row.LName }
                </div>
            ),
        },
        { field: 'EmployeeStatus', headerName: 'Status', flex: 1,
          renderCell: (params: GridRenderCellParams) => (
              <div className="pl-2">
                
                <Chip label={<Typography fontSize={9}>{params.row.EmployeeStatus}</Typography>} color="success" size="small" />
              </div>
          ),
        },
        { field: 'IsPH', headerName: 'Is Packhouse Employee ', flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <div className="pl-2">
                  {params.row.IsPH === 0 ? 
                  <Chip label={<Typography fontSize={9}>No</Typography>} color="error" size="small" /> 
                  : 
                  <Chip label={<Typography fontSize={9}>Yes</Typography>} color="success" size="small" />
                  }
                </div>
            ),
         },
        { field: "action", headerAlign: 'right',
          headerName: '',    
          width: 250,
          align: 'right',
          renderCell: (params: GridRenderCellParams) => {
            const isLoading = loadingStates[params.row.EmpID] || false;
              const selectedData = () => {
                setSelectedID(params.row.EmpID);
                dispatch(openThisDialog());
              };      
          return params.row.IsPH === 1 ? (
                ''
            ) : (
            <CustomLoadingButton 
                btnClick={() => setAsPackhouseEmployee(params.row.EmpID)}
                isDisabled={isLoading}
                btnVariant="contained"
                label={isLoading ? <> <Typography fontSize={12}>Loading</Typography> <div className="ml-1"><XSDotFlash /></div></> : <Typography fontSize={12}>SET as Packhouse Employee</Typography>}
                type="submit"
                btnSize="small"
                fullWidth={true}
            />
            );
          }
        }
      ];

    return (
        <>
        <ConfirmDialog onConfirm={setAsPackhouseEmployee} />
        <Card className="p-0">
            <CardContent className="pt-0 pb-0 pl-1 pr-1">
                <div className="grid grid-cols-3 gap-2 p-2">
                    <Input placeholder="Search Chapa ID or Lastname..." value={search} onChange={(e) => {setSearch(e.target.value)}} />
                </div>
                  <MuiDataGrid 
                      columns={ColumnHeader}
                      rows={SearchFilter(constMappedData)}
                      maxHeight={550}
                      height={550}  
                      loading={isLoading}  
                  />
            </CardContent>
        </Card>
        </>
    )
}