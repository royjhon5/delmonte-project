import { Header } from "@/components/layout/header";
import DepartmentProvider from "./context/location-context";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Main } from "@/components/layout/main";
import { customQuery } from "@/hooks/custom-hooks";
import { LocationListSchema } from "./data/data";
import { DataTable } from "./components/data.table";
import { DataColumns } from "./components/data-columns";
import { PrimaryButton } from "./components/primary-buttons";
import { DialogContainer } from "./components/group-dialogs";

export default function LocationList() {
  const { data, isLoading } = customQuery('/get-location', {}, true) || { data: undefined, isLoading: false };
  const location = (data && Array.isArray(data)) ? data.map(locations => locations) : [];
  const locationData = LocationListSchema.parse(location);
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
                    <h2 className='text-2xl font-bold tracking-tight'>Location List</h2>
                    <p className='text-muted-foreground'>
                    Manage your location data here.
                    </p>
                </div>
                    <PrimaryButton />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable data={locationData} columns={DataColumns} isLoading={isLoading} />
                </div>
            </Main>
            <DialogContainer />
        </DepartmentProvider>
    )
}