import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { employeeListSchema } from './data/schema'
import { customQuery } from '@/hooks/custom-hooks'
import { employeColumns } from './components/employee-columns'

export default function EmployeeMasterFile() {
  const { data, isLoading } = customQuery('/get-employeemasterfile', {}, true);
  const employees = (data && Array.isArray(data)) ? data.map(employee => employee) : [];
  const employeeList = employeeListSchema.parse(employees);

  return (     
    <UsersProvider>
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
              <h2 className='text-2xl font-bold tracking-tight'>Employee Masterfile</h2>
              <p className='text-muted-foreground'>
                Manage your employee's and their roles here.
              </p>
            </div>
            <UsersPrimaryButtons />     
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <UsersTable columns={employeColumns} data={employeeList} isLoading={isLoading} />
          </div>
        </Main>
        <UsersDialogs />
    </UsersProvider>
  )
}
