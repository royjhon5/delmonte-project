
import { usePathname } from '@/routes/hooks';
import ThemeToggler from '../ThemeToggler';
import Heading from './heading';
import UserNav from './user-nav';
import { navItems } from '@/constant/data';
import { Input } from '../ui/input';
import { PanelLeft, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { useState } from 'react';


// Custom hook to find the matched path
const useMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + '/') && item.href !== '/'
    );
  return matchedPath?.title || '';
};

export default function Header() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 200);
  };

  return (
    <div className="flex flex-1 items-center justify-between flex h-14 items-center gap-2 border-b dark:bg-black px-4 lg:h-[60px]">
      <div className="flex gap-2 items-center justify-between">
      {/* <Heading title={headingText} /> */}
        <Button className="rounded-full" variant="ghost" size="icon" onClick={handleToggle}>
          <PanelLeft />
        </Button>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="ml-4 flex items-center md:ml-6">
        
        <ThemeToggler />
      </div>
    </div>
  );
}
