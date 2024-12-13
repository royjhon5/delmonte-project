import DynamicBreadcrumbs from "@/components/custom/Breacrumbs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CostCenterData from "./CostCenterData";


export default function CostCenterList() {
    return (
        <>
        <div className="min-h-[100vh] flex flex-col gap-3 rounded-xl md:min-h-min">
            <Card className="p-0">
            <CardHeader className="pt-0 pb-0 pl-2">
                <CardTitle className="text-lg flex flex-col gap-0">Cost Center List
                <DynamicBreadcrumbs />
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            </Card>
            <CostCenterData /> 
        </div>
        </>
    )
}