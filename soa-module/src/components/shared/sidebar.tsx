'use client';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import DashboardNav from './dashbaord-nav';
import { navItems } from '@/constant/data';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized } = useSidebar();

  return (
    <nav
      className={cn(
        `relative border-r  z-10 hidden h-screen flex-none  px-3 md:block`,
        'duration-200',
        !isMinimized ? 'w-72' : 'w-[80px]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center px-0 py-5 md:px-2',
          isMinimized ? 'justify-center ' : 'justify-between'
        )}
      >
        {!isMinimized && <h1 className="text-2xl font-bold">Logo</h1>}
      </div>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
