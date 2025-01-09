import { Header } from "@/components/layout/header";
import DepartmentProvider from "./context/department-context";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Main } from "@/components/layout/main";
import { customQuery } from "@/hooks/custom-hooks";
import { departmentListSchema } from "./data/data";
import { DataTable } from "./components/data.table";
import { DataColumns } from "./components/data-columns";
import { PrimaryButton } from "./components/primary-buttons";
import { DialogContainer } from "./components/group-dialogs";

export default function DepartmentList() {
  const { data, isLoading } = customQuery('/get-department', {}, true);
  const department = (data && Array.isArray(data)) ? data.map(departments => departments) : [];
  const dapartmentData = departmentListSchema.parse(department);
    return (
        <DepartmentProvider>
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
                    <h2 className='text-2xl font-bold tracking-tight'>Department List</h2>
                    <p className='text-muted-foreground'>
                    Manage your department list here.
                    </p>
                </div>
                    <PrimaryButton />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable data={dapartmentData} columns={DataColumns} isLoading={isLoading} />
                </div>
            </Main>
            <DialogContainer />
        </DepartmentProvider>
    )
}