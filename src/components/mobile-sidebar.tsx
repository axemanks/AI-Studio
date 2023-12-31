// Mobile menu
'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { getApiLimitCount } from '@/lib/api-limit';

interface MobileSidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({
  apiLimitCount,
  isPro = false,
}: MobileSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        {/* mobile menu icon */}
        <Menu  className='md:hidden'/>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='p-0'
      >
        <Sidebar
          apiLimitCount={apiLimitCount}
          isPro={isPro}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
