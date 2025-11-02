'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex h-full flex-col py-6">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <Logo />
                    <span className="ml-2 font-bold">Safa Marwa</span>
                </Link>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
              <Link href="/packages" onClick={() => setIsOpen(false)}>Packages</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
