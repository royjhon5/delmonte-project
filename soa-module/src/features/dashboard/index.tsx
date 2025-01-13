import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-3 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <div className='mb-1 flex items-center justify-between space-y-2'>
          <h4 className='font-bold tracking-tight'>Select Client Name </h4>
          <div className='flex items-center space-x-2'>
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='mb-2 space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>DMPI</TabsTrigger>
              <TabsTrigger value='analytics'>
                CJ
              </TabsTrigger>
              <TabsTrigger value='reports'>
                DEAR BC
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-1'>
          <h4 className='font-bold'>Del Monte Philippines Inc.</h4>
            <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pack House
                  </CardTitle>
                  <CardTitle className='text-sm font-medium'>
                    
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>698</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>4,200,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Nice Fruit
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>425</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>39,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Juice Plant
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>537</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>10,121.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>




          <TabsContent value='analytics' className='space-y-1'>
          <h4 className='font-bold'>CJ Corporation</h4>
            <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pack House
                  </CardTitle>
                  <CardTitle className='text-sm font-medium'>
                    
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>654</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>60,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Nice Fruit
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>425</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>30,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Juice Plant
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>125</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>10,121.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>



          <TabsContent value='reports' className='space-y-1'>
          <h4 className='font-bold'>DEAR BC</h4>
            <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pack House
                  </CardTitle>
                  <CardTitle className='text-sm font-medium'>
                    
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>925</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>120,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Nice Fruit
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>225</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>10,231.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Juice Plant
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                  <div className='text-2xl font-bold'>325</div>
                  <p className='text-xs text-muted-foreground'>
                    Total No. of Heads
                  </p>
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>10,121.00</div>
                    <p className='text-xs text-muted-foreground'>
                      Total SOA Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              {/* <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card> */}
            </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
