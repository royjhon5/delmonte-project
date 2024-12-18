// import { DataTableDemo } from "@/components/custom/DataTable/DataTable";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppDispatch } from "@/store";
import { openThisDialog } from "@/store/features/openDialog";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import AddLocation from "./AddLocation";
import { DataTable } from "@/components/custom/DataTable";

export default function LocationData() {
    const dispatch = useDispatch<AppDispatch>();
    const data = [
        { id: 1, name: 'John Doe', age: 28, status: 'Active' },
        { id: 2, name: 'Jane Smith', age: 32, status: 'Inactive' },
        { id: 3, name: 'Alice Johnson', age: 24, status: 'Active' },
    ];
    const columns = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'age', header: 'Age' },
        { accessorKey: 'status', header: 'Status' },
      ];
    return (
        <>
        <AddLocation />
        <Card>
            <CardContent className="pt-0 pb-0 pl-1 pr-1">
                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="">
                    <Input placeholder="Search..." />
                    </div>
                    <div className="flex col-span-2 justify-end">
                        <Button onClick={() => dispatch(openThisDialog())}><Plus/>Add</Button>
                    </div>
                </div>
                <div className="p-2">
                    <DataTable columns={columns} data={data} />
                </div>
            </CardContent>
        </Card>
        </>
    )
}