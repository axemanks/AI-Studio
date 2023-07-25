// Sidebar
'use client';

// Global imports
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Local imports
import { cn } from '@/lib/utils';
import {
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  VideoIcon,
  Music,
  Code,
  Settings,
  MessagesSquare,
} from 'lucide-react';
import { getApiLimitCount } from '../lib/api-limit';
import { FreeCounter } from './FreeCounter';

// we want to use Montserrat font on the logo only
// we use the cn function to apply the font
const montserrat = Montserrat({ weight: '600', subsets: ['latin'] });

// Routes - array of objects
const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },  
  {
    label: 'Ask a question',
    icon: MessageSquare,
    href: '/ask',
    color: 'text-violet-500',
  },
  {
    label: 'Chat with AI',
    icon: MessagesSquare,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    href: '/chat',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    href: '/video',
    color: 'text-orange-700',
  },
  {
    label: 'Music Generation',
    icon: Music,
    href: '/music',
    color: 'text-emerald-700',
  },
  {
    label: 'Code Generation',
    icon: Code,
    href: '/code',
    color: 'text-green-700',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className='space-y-4 py-4 flex flex-col h-full bg-blue-300 text-white'>
      {/* Logo container*/}
      <div className='px-3 py-2 flex-1'>
        {/* Link to dash */}
        <Link
          href='/dashboard'
          className='flex items-center pl-3 mb-14'
        >
          <div className='relative w-8 h-8 mr-4'>
            {/* Logo */}
            <Image
              fill
              alt='logo'
              src='/logo.png'
              sizes='2xl'
            />
          </div>
          {/* Brand name */}
          {/* use cn to conditally add the class names after the tailwinds classes */}
          <h1 className={cn('text-2xl font-bold', montserrat.className)}>
            AI-Studio
          </h1>
        </Link>
        {/* Map out Routes */}
        <div className='space-y-1'>
          {routes.map((route) => (
            // route.href (the link) for href and key
            <Link
              href={route.href}
              key={route.href}
              // highlights the current route
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-black '
              )}
            >
              <div className='flex items-center flex-1'>
                {/*  Icon for each route */}
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* counter */}
      <FreeCounter
        apiLimitCount={apiLimitCount}
        isPro={isPro}
      />
    </div>
  );
};

export default Sidebar;
