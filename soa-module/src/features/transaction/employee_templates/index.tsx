import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Main } from "@/components/layout/main";
import { customQuery } from "@/hooks/custom-hooks";
import { globalListSchema } from "./data/data";
import { DataTable } from "./components/data.table";
import { DataColumns } from "./components/data-columns";
import { DialogContainer } from "./components/group-dialogs";
import MainProvider from "./context/context-provider";
import { FormActionCard } from "./components/action-card";

export default function EmployeeTemplates() {
  const { data, isLoading } = customQuery('/get-group', {}, true) || { data: undefined, isLoading: false };
  const employeeTemplates = (data && Array.isArray(data)) ? data.map(day => day) : [];
  const employeeTemplateData  = globalListSchema.parse(employeeTemplates);
    return (
        <MainProvider>
            <Header fixed>
                <Search />
                    <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
             <Main>
                <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Employee Templates</h2>
                    <p className='text-muted-foreground'>
                    Manage your Employee Templates data here.
                    </p>
                </div>
                </div>
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-3">
                        <FormActionCard />
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <DataTable data={employeeTemplateData} columns={DataColumns} isLoading={isLoading} />
                    </div>
                </div>
            </Main>
            <DialogContainer />
        </MainProvider>
    )
}