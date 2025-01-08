import { Header } from "@/components/layout/header";
import DepartmentProvider from "./context/department-context";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Main } from "@/components/layout/main";

export default function DepartmentList() {
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
                    <h2 className='text-2xl font-bold tracking-tight'>Employee List</h2>
                    <p className='text-muted-foreground'>
                    Manage your employee's and their roles here.
                    </p>
                </div>
                    
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                
                </div>
            </Main>
        </DepartmentProvider>
    )
}