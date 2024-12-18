import DynamicBreadcrumbs from "@/components/custom/Breacrumbs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UpdatePackhouseEmployeeData from "./UpdatePackHouseData";


export default function UpdatePackhouseEmployee() {
    return (
        <div className="min-h-[100vh] flex flex-col gap-3 rounded-xl md:min-h-min">
            <Card className="p-0">
            <CardHeader className="pt-0 pb-0 pl-2">
                <CardTitle className="text-lg flex flex-col gap-0">Employee Masterfile
                <DynamicBreadcrumbs />
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            </Card>
            <UpdatePackhouseEmployeeData />
        </div>
    )
}