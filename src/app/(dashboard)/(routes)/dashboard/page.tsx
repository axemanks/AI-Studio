// Dashboard - Protected Route
'use client';

import {
  ArrowRight,
  Code,
  Image,
  MessageSquare,
  MessagesSquare,
  Music,
  VideoIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card'; // shadcn card
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Array of available tools
const tools = [
  {
    label: 'Ask a Question',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    href: '/ask',
  },
  {
    label: 'Chat with AI',
    icon: MessagesSquare,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    href: '/chat',
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    href: '/music',
  },
  {
    label: 'Image Generation',
    icon: Image,
    color: 'text-pink-700',
    bgColor: 'bg-pink-700/10',
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-700',
    bgColor: 'bg-orange-700/10',
    href: '/video',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-green-700',
    bgColor: 'bg-green-700/10',
    href: '/code',
  },
];

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className='mb-8 space-y-4'>
        <h2 className='text-2xl md:text-4xl font-bold text-center'>
          Explore the power of AI
        </h2>
        <p className='text-muted-foreground font-light text-sm md:text-lg text-center'>
          Chat with the smartest AI - Expererience the power of AI
        </p>
      </div>
      {/* Tools */}
      <div className='px-4 md:px-20 lg:px-32 space-y-4'>
        {/* map the tools */}
        {tools.map((tool) => (
          // card for each tool
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className='p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer'
          >
            <div className='flex items-center gap-x-4'>
              {/* merge classnames - set background with tool.bgColor*/}
              <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                {/* display icon and pass tool.color */}
                <tool.icon className={cn('w-8 h-8', tool.color)} />
              </div>
              {/* Tool label */}
              <div className='font-semibold'>{tool.label}</div>
            </div>
            {/* Arrow */}
            <ArrowRight className='w-5 h-5' />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
