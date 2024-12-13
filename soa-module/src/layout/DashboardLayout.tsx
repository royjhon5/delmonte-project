import { AppSidebar } from '@/components/shared/app-sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex h-screen overflow-hidden dark:bg-black">
    //   <AppSidebar />
    //   <div className="w-full">
    //     <div className="sticky top-0 z-10 flex flex-col">
    //       <Header />
    //     </div>
    //     <main className="min-h-full p-4">
    //       {children}
    //     </main>
    //   </div>
    // </div>
    <>
    <AppSidebar />
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
