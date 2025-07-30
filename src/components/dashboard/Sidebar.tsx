'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, LayoutDashboard, Users, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Forms',
    href: '/dashboard/forms',
    icon: FileText,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-100 border-r">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin</h2>
      </div>
      <nav className="flex-grow px-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200',
              pathname === link.href && 'bg-gray-300 font-bold'
            )}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Link href="/dashboard/forms/create">
          <Button className="w-full">
            <Plus className="h-5 w-5 mr-2" /> Create Form
          </Button>
        </Link>
      </div>
    </div>
  );
}
