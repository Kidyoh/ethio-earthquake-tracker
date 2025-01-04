'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Bell, Settings, Map, Info, Shield, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/map', label: 'Map View', icon: Map },
    { href: '/education', label: 'Education', icon: Info },
    { href: '/safety', label: 'Safety Guide', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold pl-4">
            Ethiopia Earthquake Monitor
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center ${pathname === item.href ? 'text-blue-500' : 'text-gray-700'}`}>
              {item.icon && <item.icon className="mr-2 h-5 w-5" />}
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          {/* <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button> */}
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`flex items-center ${pathname === item.href ? 'text-blue-500' : 'text-gray-700'}`}>
                    {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                    {item.label}
                  </Link>
                ))}
                <ThemeToggle />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}